import { useState } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useToast } from './use-toast';
import { Order, AddMoneyRequest } from '../types';

export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      await runTransaction(db, async (transaction) => {
        // Create order
        const orderRef = doc(collection(db, 'orders'));
        transaction.set(orderRef, {
          ...orderData,
          createdAt: serverTimestamp()
        });

        // Update user wallet
        const userRef = doc(db, 'users', orderData.userId);
        const userDoc = await transaction.get(userRef);
        
        if (!userDoc.exists()) {
          throw new Error('User not found');
        }

        const currentWallet = userDoc.data().wallet;
        if (currentWallet < orderData.amount) {
          throw new Error('Insufficient wallet balance');
        }

        transaction.update(userRef, {
          wallet: currentWallet - orderData.amount
        });
      });

      toast({
        title: "Order placed successfully",
        description: "Your order has been submitted and will be processed shortly.",
      });
    } catch (error: any) {
      toast({
        title: "Error placing order",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createAddMoneyRequest = async (requestData: Omit<AddMoneyRequest, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'addMoneyRequests'), {
        ...requestData,
        createdAt: serverTimestamp()
      });

      toast({
        title: "Add money request submitted",
        description: "Your request has been submitted and will be reviewed by admin.",
      });
    } catch (error: any) {
      toast({
        title: "Error submitting request",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'completed' | 'cancelled') => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status
      });

      toast({
        title: "Order updated",
        description: `Order has been ${status}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const approveAddMoneyRequest = async (requestId: string, userId: string, amount: number) => {
    setLoading(true);
    try {
      await runTransaction(db, async (transaction) => {
        // Update request status
        const requestRef = doc(db, 'addMoneyRequests', requestId);
        transaction.update(requestRef, {
          status: 'approved'
        });

        // Update user wallet
        const userRef = doc(db, 'users', userId);
        const userDoc = await transaction.get(userRef);
        
        if (!userDoc.exists()) {
          throw new Error('User not found');
        }

        const currentWallet = userDoc.data().wallet;
        transaction.update(userRef, {
          wallet: currentWallet + amount
        });
      });

      toast({
        title: "Request approved",
        description: "Money has been added to user's wallet.",
      });
    } catch (error: any) {
      toast({
        title: "Error approving request",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rejectAddMoneyRequest = async (requestId: string) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'addMoneyRequests', requestId), {
        status: 'rejected'
      });

      toast({
        title: "Request rejected",
        description: "The add money request has been rejected.",
      });
    } catch (error: any) {
      toast({
        title: "Error rejecting request",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createOrder,
    createAddMoneyRequest,
    updateOrderStatus,
    approveAddMoneyRequest,
    rejectAddMoneyRequest
  };
};
