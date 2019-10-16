import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Navigation from './components/navigation.jsx';
import Carousel from './components/carousel.jsx';
import { CarouselBodyWrapper, CarouselHeaderWrapper, CarouselHeaderRed, CarouselHeaderTitle, CarouselNavbarBin, CarouselBinWrapper, Button, CarouselButtonLeft, CarouselButtonRight, CarouselViewAllWrapper, CarouselViewAllLink, CarTitle } from './components/stylesheet.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMovie: '',
      carousel: [],
      carouselByFours: [],
      currentFour: [],
      currentIndex: 0
    }

    this.fetch = this.fetch.bind(this);
    this.groupImagesByFours = this.groupImagesByFours.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  //currently hardcoded to get specific movie
  componentDidMount() {
    this.fetch('imgsmall', 21210);
  }

  //will be used to get both thumbnails and large images
  fetch(url, params) {
    axios.get(`/api/${url}/${params}`)
    .then(response => {
      console.log(response);
      this.setState({carousel: response.data})
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      this.setState({currentMovie: this.state.carousel[0].movie.title});
      this.groupImagesByFours(this.state.carousel);
    })
  }

  //this function breaks the images into an array of arrays
    //inner arrays have four images each in them
    //if movie has < 4 images total then add in 'blank' image as placeholder
  groupImagesByFours(carousel) {
    var count = carousel.length;
    var selectedFour = [];
    var allGroupsOfFour = [];
    var genericImage= {"_id": "placeholder",
      "small_url": "https://hrr41-fec-krillin-imgs.s3-us-west-1.amazonaws.com/ph-thumb.gif"};

    if (carousel.length < 4) {
      selectedFour = carousel.slice();
      while (selectedFour.length < 4) {
        selectedFour.push(genericImage);
      }
      allGroupsOfFour.push(selectedFour);
    }

    var i = 0;
    while (i < count) {
      selectedFour = carousel.slice(i, i + 4);
      if (selectedFour.length < 4) {
        selectedFour = carousel.slice(-4);
      }
      allGroupsOfFour.push(selectedFour);
      i = i + 4;
    }

    this.setState({carouselByFours: allGroupsOfFour});
    this.setState({currentFour: this.state.carouselByFours[0]});
  }

  //change currentFour displayed (cycle through carousel)
  handleClick(event) {
    var maxLength = this.state.carouselByFours.length - 1;
    var upIndex = this.state.currentIndex + 1;
    var downIndex = this.state.currentIndex - 1;

    if (event.target.value === '>') {
      if (this.state.currentIndex === maxLength) {
        this.setState({currentFour: this.state.carouselByFours[0],
          currentIndex: 0})
      } else {
        this.setState({currentFour: this.state.carouselByFours[upIndex],
          currentIndex: upIndex})
      }
    }
    if (event.target.value === '<') {
      if (this.state.currentIndex === 0) {
        this.setState({currentFour: this.state.carouselByFours[maxLength],
          currentIndex: maxLength})
      } else {
        this.setState({currentFour: this.state.carouselByFours[downIndex],
          currentIndex: downIndex})
      }
    }
  }

  render() {
    return (
      <CarouselBodyWrapper>
        <CarouselHeaderWrapper>
          <CarouselHeaderRed>
            <CarouselHeaderTitle>
              <CarTitle>{this.state.currentMovie}</CarTitle> PHOTOS
            </CarouselHeaderTitle>
          </CarouselHeaderRed>
          <CarouselNavbarBin>
            <Navigation total={this.state.carouselByFours} index={this.state.currentIndex} />
          </CarouselNavbarBin>
        </CarouselHeaderWrapper>
        <CarouselBinWrapper>
          <CarouselButtonLeft value="<" onClick={this.handleClick}> {'<'} </CarouselButtonLeft>
          <Carousel carousel={this.state.currentFour} />
          <CarouselButtonRight value=">" onClick={this.handleClick}> {'>'} </CarouselButtonRight>
        </CarouselBinWrapper>
        <CarouselViewAllWrapper>
          <CarouselViewAllLink href="http://www.google.com">View All Photos ({this.state.carousel.length})
          </CarouselViewAllLink>
        </CarouselViewAllWrapper>
      </CarouselBodyWrapper>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('imgcarousel'));
