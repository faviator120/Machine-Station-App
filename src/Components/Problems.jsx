import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { List } from 'react-virtualized';
import { db } from '../FirebaseConfig/firebaseConfig';
import { onValue, ref, off, remove, update } from 'firebase/database';




const ProblemList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    
    const itemsRef = ref(db, 'Problems');

    // Attach an event listener to fetch the items
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const itemList = data ? Object.values(data) : [];
      setItems(itemList);
    });

    // Clean up the event listener on unmount
    return () => {
      off(itemsRef)
    };
  }, []);

  const rowRenderer = ({ index, key, style }) => {
    const item = items[index];
    return (
      <Card key={key} style={style}>
        <Card.Body>
          <Card.Title>{item.Title}</Card.Title>
          <Card.Text>
            <strong>Category:</strong> {item.Catagory}<br />
             {item.KeyWords}
          </Card.Text>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <List
        width={window.innerWidth}
        height={window.innerHeight}
        rowCount={items.length}
        rowHeight={120}
        rowRenderer={rowRenderer}
      />
    </div>
  );
};

export default ProblemList;
