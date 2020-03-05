import React, { useEffect, useState } from 'react';
// TO CONNECT PAGE TO STORE

import { connect } from 'react-redux';
// TO USE MAPDISPATCHTOPROPS
import { bindActionCreators } from 'redux';
import { ProductList } from './styles';
import { MdAddShoppingCart } from 'react-icons/md';
import api from '../../services/api';
// TO FORMAT THE PRICE
import { price } from '../../util/format';
// ACTIONS SIMPLY CALL A FUNCTION AND SPECIFY TYPE
import * as CartActions from '../../store/modules/cart/actions';

const Home = props => {
  const [products, handleProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const response = await api.get('products');
    const data = response.data.map(product => ({
      ...product,
      formatedPrice: price(product.price)
    }));

    handleProducts(data);
  }

  async function handleAddProd(product) {
    props.addToCartRequest(product.id);
  }

  return (
    <ProductList>
      {products.map(product => (
        <li key={product.id}>
          <img src={product.image} alt="shoes" />
          <strong>{product.title}</strong>
          <span>{product.formatedPrice}</span>
          <button type="button" onClick={() => handleAddProd(product)}>
            <div>
              <MdAddShoppingCart size={16} color="#FFF" />
              {props.amount[product.id] || 0}
              <span>Add to Cart</span>
            </div>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

// BINDS ACTIONS TO DISPATCH WITHOUT HAVING TO CALL DISPATCH
const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;
    return amount;
  }, {})
});

//IN ORDER TO NOT HAVE TO USE DISPATCH, THIS ALLOWS US TO USE FUNCTION SUCH AS CART.ADDTOCART
const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
