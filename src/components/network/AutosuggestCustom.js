import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';

import '../../views/styles/Autosuggest.css';

export default class AutosuggestCustom extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            id: props.id,
            value: props.value,
            item: props.item,
            list: props.list,
            suggestions: []
      };    
    }
    
    componentWillUnmount() {

    }

    componentWillReceiveProps(props) {
        // From placement suggest 
        // console.log(props)
        this.setState({ 
            list: this.state.list = props.list,
            suggestions: this.state.suggestions = props.list 
        });
    }

    escapeRegexCharacters = (str) => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
      
    getSuggestions = (value) => {
        const escapedValue = this.escapeRegexCharacters(value.trim());
        
        // console.log(escapedValue)
        
        // if (escapedValue === '') {
        //   return this.state.list;
        // }
      
        const regex = new RegExp('^' + escapedValue, 'i');
        
        // get filters
        let list  = this.state.list.filter(item => regex.test(item.title));
        return list
    }
      
    getSuggestionValue = (suggestion) => {

        if(this.props.selectUpliner) {
            this.props.selectUpliner(this.state.item, suggestion);
        }
        return suggestion.title;
    }
      
    renderSuggestion(suggestion) {
        return (
          <span>{suggestion.title}</span>
        );
    }

    shouldRenderSuggestions = () => {
        return true;
    }
      
    onChange = (event, { newValue, method }) => {
        // console.log(method)
        // console.log(newValue)
        this.setState({
            value: newValue
        });
    };
    
    onSuggestionsFetchRequested = ({ value }) => {
      this.setState({
        suggestions: this.state.suggestions = this.getSuggestions(value)
      });
    };
  
    onSuggestionsClearRequested = () => {
      this.setState({
        suggestions: this.state.suggestions = this.state.list
      });
    };
  
    render() {
      const { id, value, suggestions } = this.state;
      const inputProps = {
            id: id,
            placeholder: "Ingrese un nombre ...",
            value: value,
            onChange: this.onChange
      };
  
      return (
        <Autosuggest 
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            shouldRenderSuggestions={this.shouldRenderSuggestions}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps} />
      );
    }
  }
  
  