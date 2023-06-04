import React, { Component } from 'react';
import {RoadmapList} from './RoadmapsList'
import {ElementList} from './ElementList';
import {ElementView} from './ElementView';
import { Container } from 'reactstrap';

class RoadMapView extends Component
{

    constructor(props){
        super(props);

        console.log(props.categoryId);

        this.state = {
            categoryId: props.categoryId,
            roadmapId: 0,
            elementId: 0,
            ElListHandler: null,
            ElHandler: null}
    }

    async onSelectRoadmap(id){
        this.ElListHandler?.loadElements(id);
    }
    
    async onSelectElement(){
        console.log(this.state.elementId);
        this.ElHandler.fetchData();
    }

    render(){
        const Hthis = this;
        const id = this.state.roadmapId;
        const Elid = this.state.elementId;
        const categoryId = this.state.categoryId;
 
        return (
        <Container>
            <RoadmapList parent={Hthis} categoryId={categoryId}/>
            <ElementList parent={Hthis} roadmapId={id}/>
            <hr/>
            <ElementView parent={Hthis} id={Elid}/>
        </Container>
        );
    }


}

export {RoadMapView}