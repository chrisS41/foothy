import { React } from 'react';
import {
  EmailShareButton,
  FacebookShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton
} from 'react-share'; // leaving this these imports in case we want to add more social networking sites to share to

import { FaFacebook, FaTwitter, FaPinterest } from 'react-icons/fa';

import '../components/styles/ShareRecipeButtons.css';

const HASHTAG = ['FOOTHY', 'healthy', 'food', 'recipe']; 
const URL = window.location.href;
const GENERATE_MESSAGE = title => `Check out this awesome ${title} recipe!`;

export const FacebookButton = props => {
  return(
  <FacebookShareButton url={props.url} quote={GENERATE_MESSAGE(props.title)} hashtag="FOOTHY">
    <FaFacebook className="facebook-icon" size={32}/>
  </FacebookShareButton>);
}


export const TwitterButton = props => {
  return(
  <TwitterShareButton url={props.url} title={GENERATE_MESSAGE(props.title)} hashtags={HASHTAG}>
    <FaTwitter className="twitter-icon" size={32}/>
  </TwitterShareButton>);
}

export const PinterestButton = props => {
  return(
  <PinterestShareButton url={props.url} media={props.image} description={GENERATE_MESSAGE(props.title)}>
    <FaPinterest className="pinterest-icon" size={32}/>
  </PinterestShareButton>)
}