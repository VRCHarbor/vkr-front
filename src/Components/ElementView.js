import React, {Component} from 'react';
import {
    Container
}
from 'reactstrap';
import {API_Controls, GetElementFromAPI} from "../Constants/Paths";
import "./MDImage.css"
import ReactMarkdown from "react-markdown";
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

class ElementView extends Component{
    constructor(props){
        super(props);

        this.state = {
            text:"",
            EditDate:"",
            Title: "",
            Id:props.id,
            IsLoading:true,
            parent: props.parent,
        };
        props.parent.ElHandler = this;
    }

    componentDidMount(){
        this.fetchData();
    }

    async fetchData(){
        var responce = await fetch(GetElementFromAPI.GetRoadMapElement(this.state.parent.state.elementId));
        if(responce.ok){
            var data = await responce.json();
            console.log(data);
            this.setState({
                text: data.content,
                EditDate: data.editDate,
                Title: data.title,
                IsLoading: false,
            });
        }
        
    }

    render(){
        if(this.state.IsLoading){
            return(<p>Loading...</p>);
        }

        return(
            <Container className='text-justify'>
                <h2>
                    {this.state.Title}
                </h2>
                <ReactMarkdown
                className='md-container'
                rehypePlugins={[rehypeHighlight]}
                remarkPlugins={[remarkGfm]}
                >
                    {this.state.text}
                </ReactMarkdown>
                <hr/>
                <i>
                    {this.state.EditDate}
                </i>
            </Container>
            );
    }
}

export {ElementView}