// src/Dashboard.jsx

import { useEffect, useState } from 'react';
import { webDB, androidDB } from './firebase';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [checkedOrders, setCheckedOrders] = useState({}); 

  const fetchCustomerData = async (customerID) => {
    try {
      const customerRef = doc(db, 'customers', customerID);
      const customerDoc = await getDoc(customerRef);
      return customerDoc.exists() ? customerDoc.data() : null;
    } catch (error) {
      console.error('Error fetching customer data:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchFromDB = (dbInstance) =>
      new Promise((resolve) => {
        onSnapshot(collection(dbInstance, 'orders'), async (snapshot) => {
          const ordersWithCustomerData = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
              const orderData = docSnap.data();
              let customer = null;
              try {
                const customerRef = doc(dbInstance, 'customers', orderData.customerID);
                const customerDoc = await getDoc(customerRef);
                if (customerDoc.exists()) customer = customerDoc.data();
              } catch (e) {
                console.error('Error fetching customer data:', e);
              }
              return { id: docSnap.id, ...orderData, customer };
            })
          );
          resolve(ordersWithCustomerData);
        });
      });
  
    const mergeOrders = async () => {
      const [webOrders, androidOrders] = await Promise.all([
        fetchFromDB(webDB),
        fetchFromDB(androidDB),
      ]);
  
      const allOrders = [...webOrders, ...androidOrders].sort((a, b) => {
        const timeA = a.timestamp?.toDate?.() || new Date(0);
        const timeB = b.timestamp?.toDate?.() || new Date(0);
        return timeB - timeA;
      });
  
      setOrders(allOrders);
  
      const initialChecks = {};
      allOrders.forEach((order) => {
        initialChecks[order.id] = false;
      });
      setCheckedOrders(initialChecks);
    };
  
    mergeOrders();
  }, []);

  const formatTimestamp = (ts) => {
    if (!ts) return 'No Timestamp';
    if (typeof ts.toDate === 'function') return ts.toDate().toLocaleString();
    if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleString();
    return 'Invalid Timestamp';
  };
  

  return (
    <div>
      <h1>Owner Dashboard</h1>
      {orders.map(order => (
        <div key={order.id} style={{ borderBottom: '1px solid #ccc', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Customer:</strong> {order.customer ? `${order.customer.customerName} (${order.customer.customerEmail})` : 'Guest'}</p>
          <p><strong>Customer Address:</strong> {order.deliveryAddress || 'No Address'}</p>
          <p><strong>Branch:</strong> {order.branchID || 'N/A'}</p>
          <p><strong>Flavors:</strong> {order.flavor1ID || 'N/A'}, {order.flavor2ID || 'N/A'}, {order.flavor3ID || 'N/A'}</p>
          <p><strong>Timestamp:</strong> {formatTimestamp(order.timestamp)}</p>
        </div>
      ))}
    </div>
  );
}
