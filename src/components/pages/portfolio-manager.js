import React, { Component } from 'react';
import axios from 'axios';

import PortfolioSidebarList from '../portfolio/portfolio-sidebar-list';
import PortfolioForm from '../portfolio/portfolio-form';


export default class PortfolioManager extends Component {

  constructor() {
    super();

        this.state = {
            portfolioItems: [],
            portfolioToEdit: {}
        };

        this.handleNewFormSubmission = this.handleNewFormSubmission.bind(this);
        this.handleEditFormSubmission = this.handleEditFormSubmission.bind(this);
        this.handleFormSubmissionError = this.handleFormSubmissionError.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.clearPortfolioToEdit = this.clearPortfolioToEdit.bind(this); //? 1 created portfolioToEdit function
      }
      
    clearPortfolioToEdit() { //? 1 Created portfolioToEdit function
      this.setState({ // This function only returns the portfolioToEdit state into an empty object.
        portfolioToEdit: {}
      });
    }



    handleEditClick(portfolioItem) {
      this.setState({
        portfolioToEdit: portfolioItem
      })
    }

    handleDeleteClick(portfolioItem) {
      axios.delete(`https://api.devcamp.space/portfolio/portfolio_items/${portfolioItem.id}`, 
      { withCredentials: true }
      )
    .then(response => {
      this.setState({
        portfolioItems: this.state.portfolioItems.filter(item => {
          return item.id !== portfolioItem.id;
        })
      });

      return response.data;
    }).catch(error=> {
      console.log("handleDeleteClick error", error);
    });
  }

    handleEditFormSubmission() {
      this.getPortfolioItems();
    }

    handleNewFormSubmission(portfolioItem) {
      this.setState({
        portfolioItems: [portfolioItem].concat(this.state.portfolioItems) // Adds single item array onto multi item array. portfolioItem gets added to portfolioItems on the top.
      });
    }

    handleFormSubmissionError(error) {
      
    }

    getPortfolioItems() {
        axios.get("https://ryanschmutzler.devcamp.space/portfolio/portfolio_items?order_by=created_at&direction=desc", {withCredentials: true //Specific to API's. you can put different parameters like lat and long or city and state name.
        }).then(response => {
            this.setState({
                portfolioItems: [...response.data.portfolio_items]
            })
        }).catch(error => {
            console.log("error in getPortfolioItems", error);
        })
    }

    componentDidMount() {
        this.getPortfolioItems();
    }
    

    
  render() {
    return (
      <div className="portfolio-manager-wrapper">
        <div className="left-column">
            <PortfolioForm 
            handleNewFormSubmission={this.handleNewFormSubmission}
            handleEditFormSubmission={this.handleEditFormSubmission}
            handleFormSubmissionError={this.handleFormSubmissionError}
            clearPortfolioToEdit={this.clearPortfolioToEdit} //? 2 past in clearPortfolioToEdit & portfolioToEdit directly into the Portfolio form component
            portfolioToEdit={this.state.portfolioToEdit}
            />
        </div>

        <div className="right-column">
            <PortfolioSidebarList 
            data={this.state.portfolioItems} 
            handleDeleteClick={this.handleDeleteClick}
            handleEditClick={this.handleEditClick}
            />
        </div>
      </div>
    );
  }
}
