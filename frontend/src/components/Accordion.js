import React, { Component } from 'react';
import './styles/AccordionItem.css';

class AccordionItem extends Component {
  constructor(props) {
    super(props);

    this.state = { expanded: false };

    this.toggleExpand = this.toggleExpand.bind(this);
  }

  toggleExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { expanded } = this.state;
    const { index } = this.props;
  return(
      <div className="accordion-item">
        <button className="accordion-item-header" 
        id={`accordion-header-${index}`}
        onClick={this.toggleExpand} 
        aria-expanded={expanded}
        aria-controls={`accordion-panel-${index}`}
        >
          <div className="accordion-item-label">
            {this.props.label}</div>
          <div className="accordion-item-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={`bi bi-chevron-right chevron-icon ${expanded ? 'active' : ''}`} viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </div>
        </button>
        <section 
        className={`accordion-item-body ${expanded ? 'active' : ''}`}>
          <div className="accordion-item-body-text" 
          aria-labelledby={`accordion-header-${index}`}
          tabIndex={0}
          id={`accordion-panel-${index}`}
          role="definition"
          aria-hidden={!expanded}>
            {this.props.text}
          </div>
        </section>
      </div>
    )
  }
}

export class Accordion extends Component {

  render() {
    return(
      this.props.items.map((item, index)=> <AccordionItem label={item.label} text={item.text} index={index}/>)
    );
  }
}