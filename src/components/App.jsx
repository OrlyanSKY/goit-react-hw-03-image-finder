import { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

import { pixabayAPI } from 'services/pixabayAPI';

import { Container } from './Container/Container.styled';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';

export class App extends Component {
  state = {
    searchQuery: '',
    page: 1,
    items: [],
    loading: false,
    modalShow: false,
    largeImage: '',
    totalHits: 0,
  };

  async componentDidUpdate(_, prevState) {
    const { page, searchQuery } = this.state;

    if (prevState.page !== page || prevState.searchQuery !== searchQuery) {
      this.setState({ loading: true });
      try {
        const response = await pixabayAPI(searchQuery, page);
        this.setState({ totalHits: response.totalHits });

        if (response.hits.length === 0) {
          return toast.error('There are no such images!');
        }

        this.setState(prevState => ({
          items: [...prevState.items, ...response.hits],
        }));
      } catch (error) {
        return toast.error('Ooooops...try again later!');
      } finally {
        this.setState({ loading: false });
      }
    }
  }

  getSearchQueryValue = value => {
    this.setState({
      searchQuery: value,
      page: 1,
      items: [],
      disableBtn: false,
    });
  };

  loadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  showModal = image => {
    this.setState({ largeImage: image });
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState(({ modalShow }) => ({
      modalShow: !modalShow,
    }));
  };

  render() {
    const { items, loading, modalShow, largeImage, totalHits } = this.state;

    return (
      <Container>
        <Searchbar onSubmit={this.getSearchQueryValue} />
        <ImageGallery items={items} onClick={this.showModal} />

        <Loader visible={loading} />
        {items.length !== 0 && items.length < totalHits && (
          <Button onClick={this.loadMore} />
        )}
        {modalShow && <Modal image={largeImage} onClose={this.toggleModal} />}

        <ToastContainer position="top-center" autoClose={3000} theme="dark" />
      </Container>
    );
  }
}
