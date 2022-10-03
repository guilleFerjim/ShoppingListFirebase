import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList } from 'react-native';
import { initializeApp } from'firebase/app';
import { getDatabase, push, ref, onValue, remove, refFromURL } from 'firebase/database';

export default function App() {

  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [products, setProducts] = useState([]);
  const [references, setReferences] = useState([]);

  const firebaseConfig = {
    apiKey: "AIzaSyCQtbYVI1z1MoFZ6KinJKB9GwNfPCFSAms",
    authDomain: "shppinglistfirebase.firebaseapp.com",
    databaseURL: "https://shppinglistfirebase-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "shppinglistfirebase",
    storageBucket: "shppinglistfirebase.appspot.com",
    messagingSenderId: "245704812229",
    appId: "1:245704812229:web:122e9bd9421f5c9bf932ac"
  };
  
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const saveProduct = () => {  
    const productRef = push( 
      ref(database, 'products/'), { 'product': product, 'amount': amount }
    )
    setReferences(...references, { productRef: productRef });
  }

  const removeProduct = (key) => {
    remove(ref(database, 'products/'))
  }

  useEffect(() => {
    const productsRef = ref(database, 'products/');  
    onValue(
      productsRef, (snapshot) => {
        const data = snapshot.val();    
        if (data !== null)
          setProducts(Object.values(data));  
      }
    )
  },[]);

  return (
    <View style={styles.container}>
      <View style={styles.inputs}>
        <TextInput style={styles.input} onChangeText={product => setProduct(product)} value={product} placeholder="Product" />
        <TextInput style={styles.input} onChangeText={amount => setAmount(amount)} value={amount} placeholder="Amount"/>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Button onPress={saveProduct} title="Save" />
      </View>
      <Text style={{fontWeight: "bold", marginTop: 15}}>SHOPPING LIST</Text>
      <FlatList  
        keyExtractor={item => item.key}   
        renderItem={({item}) =>
          <View flexDirection='row'>
            <Text>{item.product}, {item.amount}, {item.id} </Text>
            <Text style={{color: 'blue'}} onPress={() => removeProduct(item.key)}>remove</Text>
          </View>}        
        data={products} 
      /> 
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    marginTop: 10,
    marginBottom: 5,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1 
  },
  inputs: {
    marginTop:50
  }
});