import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import MainPageContext from './pages/MainPage/MainPageContext';
import {firstPageMediaUrl} from "./api/urls";

class App extends Component {

  state = {
    navigationClosed: true,
    headerCircleRotation: 0,
    mainPageCurrentPromo: [{}],
    mainPageCurrentSlides: [],
    mainPageMediaLoading: true,
    mainPageContentPromo: [{}],
    mainPageTeam: [{}],
    currentShops: [],
  }

  toggleNavigation = () => {
    this.setState({
      navigationClosed: !this.state.navigationClosed,
    })
  }

  rotateHeaderCircle = () => {
    const rotationValue = window.scrollY;
    const rotationReducer = 10;
    const currentRotation = rotationValue/rotationReducer;
    this.setState({
      headerCircleRotation: currentRotation,
    })
  }

  getMainPageMedia = () => {
    fetch(firstPageMediaUrl)
      .then(response => response.json())
      .then(data => {
        this.setState({
          ...this.state,
          mainPageCurrentPromo: data?.promo,
          mainPageCurrentSlides: data?.slider,
          mainPageContentPromo: data?.content,
          mainPageTeam: data?.team,
          currentShops: data?.shops,
          mainPageMediaLoading: false,
        })
      })
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <MainPageContext.Provider
              value={{
                navigationClosed: this.state.navigationClosed,
                currentPromo: this.state.mainPageCurrentPromo,
                currentSlides: this.state.mainPageCurrentSlides,
                headerCircleRotation: this.state.headerCircleRotation,
                toggleNavigation: this.toggleNavigation,
                rotateHeaderCircle: this.rotateHeaderCircle,
                getMainPageMedia: this.getMainPageMedia,
                contentPromo: this.state.mainPageContentPromo,
                mediaLoading: this.state.mainPageMediaLoading,
                teamList: this.state.mainPageTeam,
                currentShops: this.state.currentShops,
              }}
            >
              <Route path="/" exact component={MainPage} />
            </MainPageContext.Provider>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;
