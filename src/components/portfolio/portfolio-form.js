import React, { Component } from 'react';
import axios from 'axios';
import DropzoneComponent from "react-dropzone-component";

import "../../../node_modules/react-dropzone-component/styles/filepicker.css";
import "../../../node_modules/dropzone/dist/min/dropzone.min.css";




export default class PortfolioForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            description:"",
            category: "eCommerce", // Must put default in empty string for updating dropdown with out a change
            position: "",
            url: "",
            thumb_image: "",
            banner_image: "",
            logo: "",
            editMode: false, // to update server making it dynamic
            apiUrl: "https://ryanschmutzler.devcamp.space/portfolio/portfolio_items",
            apiAction: 'post'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.componentConfig = this.componentConfig.bind(this);
        this.djsConfig = this.djsConfig.bind(this);
        this.handleThumbDrop = this.handleThumbDrop.bind(this);
        this.handleBannerDrop = this.handleBannerDrop.bind(this);
        this.handleLogoDrop = this.handleLogoDrop.bind(this);
        this.deleteImage = this.deleteImage.bind(this);

        this.thumbRef = React.createRef();
        this.bannerRef = React.createRef();
        this.logoRef = React.createRef();
    }

    deleteImage(imageType) {
        axios.delete(`https://api.devcamp.space/portfolio/delete-portfolio-image/${this.state
        .id}?image_type=${imageType}`, 
        { withCredentials: true }
        ).then(response => {
            this.setState({
                [`${imageType}_url`]: "" // When you dont know the exact name of the key wrap in []
            })
        }).catch(error => {
            console.log("deleteImage error", error);
        })
    }
                            
    componentDidUpdate() { //? 3 Created componentDidUpdate function
        if (Object.keys(this.props.portfolioToEdit).length > 0) { //? 4 Check the portfolioToEdit. Is this an empty object then skip entire process.
            const { // Keys are stored in a local variable
                id, //? 5 If there is something then grab each key then first grab each one of the portfolioToEdit keys
                name,
                description,
                category,
                position,
                url,
                thumb_image_url,
                banner_image_url,
                logo_url,
                
            } = this.props.portfolioToEdit; //? 5 If there is something then grab each key then first grab each one of the portfolioToEdit keys

            this.props.clearPortfolioToEdit(); //? 6 Clearing the value so it is know longer there so that the if statement doesnt keep getting fired on every single change

            this.setState({ //? 7 Calling this.setState in the local state for my portfolio form. That is how it grabs each value
            id: id,
            name: name || "", // this passes in a default  value if name is not their. 
            description: description || "", // This protects against null || errorss.
            category: category || "eCommerce", // everything together updates the local state and then treat all the data as its local.
            position: position || "",
            url: url || "",
            editMode: true, // to update server making it dynamic
            apiUrl: `https://ryanschmutzler.devcamp.space/portfolio/portfolio_items/${id}`,
            apiAction: 'patch',
            thumb_image_url: thumb_image_url || "", 
            banner_image_url: banner_image_url || "",
            logo_url: logo_url || "" 
            });
        }
    }

    handleThumbDrop() { // Checks if file that is dropped in is approved and then sets state to that file 
        return{
            addedfile: file => this.setState({ thumb_image: file})
        };
    }

    handleBannerDrop() { // Checks if file that is dropped in is approved and then sets state to that file 
        return{
            addedfile: file => this.setState({ banner_image: file})
        };
    }

    handleLogoDrop() { // Checks if file that is dropped in is approved and then sets state to that file 
        return{
            addedfile: file => this.setState({ logo: file})
        };
    }

    

    componentConfig() { // Uses react dropzone 
        return {
            iconFileTypes: [".jpg", ".png"], // to allows picture files to be posted
            showFiletypeIcon: true,
            postUrl: "https://httpbin.org/post" // Allows the files to not be posted until the save or submit button is pressed.
        };
    }

    djsConfig() {
        return {
            addRemoveLinks: true,
            maxFiles: 1
        };
    }

    buildForm() {
        let formData =  new FormData();

        formData.append("portfolio_item[name]", this.state.name);
        formData.append("portfolio_item[description]", this.state.description);
        formData.append("portfolio_item[url]", this.state.url);
        formData.append("portfolio_item[category]", this.state.category);
        formData.append("portfolio_item[position]", this.state.position);

        if (this.state.thumb_image) { // If there was no IF statement and there was not an image available then errors would occure.
            formData.append("portfolio_item[thumb_image]", this.state.thumb_image);
        }

        if (this.state.banner_image) {
            formData.append("portfolio_item[banner_image]", this.state.banner_image);
        }

        if (this.state.logo) {
            formData.append("portfolio_item[logo]", this.state.logo);
        }
        

        return formData;
    }
    

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        axios({
            method: this.state.apiAction,
            url: this.state.apiUrl,
            data: this.buildForm(),
            withCredentials: true
        })
        .then(response => {
            if (this.state.editMode) {
                this.props.handleEditFormSubmission();
            } else {
                this.props.handleNewFormSubmission(response.data.portfolio_item);
            }
            

            this.setState ({
                name: "",
                description:"",
                category: "eCommerce", // Must put default in empty string for updating dropdown with out a change
                position: "",
                url: "",
                thumb_image: "",
                banner_image: "",
                logo: "",
                editMode: false, // to update server making it dynamic
                apiUrl: `https://ryanschmutzler.devcamp.space/portfolio/portfolio_items/${id}`,
                apiAction: 'patch'
            });
            

            [this.thumbRef, this.bannerRef, this.logoRef].forEach(ref => {
                ref.current.dropzone.removeAllFiles(); // Puts all refs in array. then forEach iterates through each ref and removes all files
            });
        })
        .catch(error => {
            console.log("portfolio form handleSubmit error", error);
        })


        event.preventDefault(); // stops submit buttons from refreshing page
    }

  render() {
    return (
        
            
            <form onSubmit={this.handleSubmit} className="portfolio-form-wrapper">
                <div className="two-column">
                    <input                                 //Creating an input field
                    type="text"
                    name="name"
                    placeholder="Portfolio Item Name"
                    value={this.state.name}
                    onChange={this.handleChange}
                    />
                    
                    <input
                    type="text"
                    name="url"
                    placeholder="URL"
                    value={this.state.url}
                    onChange={this.handleChange}
                    />
                </div>

                <div className="two-column">
                    <input
                    type="text"
                    name="position"
                    placeholder="Position"
                    value={this.state.position}
                    onChange={this.handleChange}
                    />
                    
                    <select                             //DROP DOWN MENU
                    name="category"
                    value={this.state.category}
                    onChange={this.handleChange}
                    className="select-element"
                    >
                        <option value="eCommerce">eCommerce</option>    
                        <option value="Scheduling">Scheduling</option>  
                        <option value="Enterprise">Enterprise</option>
                    </select>
                </div>

                <div className="one-column">
                    <textarea                              //Creating an input field
                     type="text"
                     name="description"
                     placeholder="Description"
                     value={this.state.description}
                     onChange={this.handleChange}
                    />
                </div>

                <div className="image-uploaders">

                    {this.state.thumb_image_url && this.state.editMode ? (
                     <div className="portfolio-manager-image-wrapper">
                        <img src={this.state.thumb_image_url} />

                        <div className="image-removal-link">
                            <a onClick={() => this.deleteImage("thumb_image")}>
                                Remove file
                            </a>
                        </div>
                     </div>
                     ) : (
                    <DropzoneComponent
                    ref={this.thumbRef}
                    config={this.componentConfig()}
                    djsConfig={this.djsConfig()}
                    eventHandlers={this.handleThumbDrop()}
                    >
                        <div className="dz-message">Thumbnail</div>
                    </DropzoneComponent> 
                    )}



                    {this.state.banner_image_url && this.state.editMode ? (
                     <div className="portfolio-manager-image-wrapper">
                        <img src={this.state.banner_image_url} />
                        <div className="image-removal-link">
                            <a onClick={() => this.deleteImage("banner_image")}>
                                Remove file
                            </a>
                        </div>
                     </div>
                      ) : (
                        
                    <DropzoneComponent
                    ref={this.bannerRef}
                    config={this.componentConfig()}
                    djsConfig={this.djsConfig()}
                    eventHandlers={this.handleBannerDrop()}
                    >
                        <div className="dz-message">Banner Image</div>
                    </DropzoneComponent> 
                )}




                    {this.state.logo_url && this.state.editMode ? (
                     <div className="portfolio-manager-image-wrapper">
                        <img src={this.state.logo_url} />
                        <div className="image-removal-link">
                            <a onClick={() => this.deleteImage("logo")}>
                                Remove file
                            </a>
                        </div>
                     </div>
                      ) : (
                    <DropzoneComponent
                    ref={this.logoRef}
                    config={this.componentConfig()}
                    djsConfig={this.djsConfig()}
                    eventHandlers={this.handleLogoDrop()}
                    >
                        <div className="dz-message">Logo</div>
                    </DropzoneComponent> 
                      )}
                </div>

                <div>
                    <button className="btn" type="submit">
                        Save
                    </button>
                </div>
            </form>
        
    )
  }
}
