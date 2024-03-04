import React, {Component} from 'react';
import './styles/SingleRecipeHealthRating.css'
import { Link } from 'react-router-dom';
import { BsQuestionCircleFill } from 'react-icons/bs';

import rating1 from '../pages/img/Avocado1.png'
import rating2 from '../pages/img/Avocado2.png'
import rating3 from '../pages/img/Avocado3.png'


class SingleRecipeHealthRating extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rating : this.props.rating,
        };

    }


    render() {
        if(this.state.rating == 1)
        return (
            <div className="ratingContainer">
                <h2 className="healthRatingText">Health Rating <Link to="/help" className="ratingHelpLink"><button className="ratingHelpButton"><BsQuestionCircleFill/></button></Link></h2>
                <div className="ratingSpacer"/>
                <img src={rating1} className="healthRatingImage"/>
            </div>
        )
        else if(this.state.rating == 2)
        return (
            <div className="ratingContainer">
                <h2 className="healthRatingText">Health Rating <Link to="/help" className="ratingHelpLink"><button className="ratingHelpButton"><BsQuestionCircleFill/></button></Link></h2>
                <div className="ratingSpacer"/>
                <img src={rating2} className="healthRatingImage"/>
            </div>
        )
        else
        return (
            <div className="ratingContainer">
                <h2 className="healthRatingText">Health Rating <Link to="/help" className="ratingHelpLink"><button className="ratingHelpButton"><BsQuestionCircleFill/></button></Link></h2>
                <div className="ratingSpacer"/>
                <img src={rating3} className="healthRatingImage"/>
            </div>
        )
    }



}

export default SingleRecipeHealthRating;