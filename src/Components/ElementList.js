import React, {Component} from 'react';
import {
    Container,
    ListGroup,
    ListGroupItem,
    Button
}
from 'reactstrap';
import {API_Controls, GetElementFromAPI} from "../Constants/Paths"

class ElementList extends Component{
    constructor(props){
        super(props);
        this.state = {Elements: [], isLoading:true, parent: props.parent}
        props.parent.ElListHandler = this;
    }

    async loadElements(id){
        var responce = await fetch(GetElementFromAPI.GetRoadMap(id));
    
        if(responce.ok){
            var data = await responce.json();
            this.state.parent.elementId = data.elements.length > 0? data.elements[0].id: 0;
            this.setState({Elements:data.elements, isLoading:false});
        }
    }   

    renderBody(){
        const Hthis = this;
        const ElArr = this.state.Elements;

        const ListItemArr = ElArr.map(i =>
            <ListGroupItem key={i.id}  color={'success'} tag={Button} onClick={() => {
                Hthis.state.parent.state.elementId = i.id;
                Hthis.state.parent.onSelectElement(i.id);
                }}>
                {i.title}
            </ListGroupItem>
        );

        return(
        <ListGroup horizontal>
            {ListItemArr}
        </ListGroup>);
    }

    render(){

        var body = this.state.isLoading? "Loading..." : this.renderBody();

        if(this.state.isLoading){
            this.loadElements(this.state.parent.state.roadmapId);
        }

        return(<Container>{body}</Container>);
    }
}

export {ElementList}