import React, {Component} from 'react';
import {Container, Accordion, AccordionItem, AccordionBody, Button, ListGroup, ListGroupItem} from 'reactstrap';
import {API_Controls, GetElementFromAPI} from "../Constants/Paths"
import {RoadMapView} from './RoadmapView';



class RoadmapList extends Component{
    constructor(props){
        super(props)
        this.state = {isLoading:true, Roadmaps: [], Categories: [], parent: props.parent, CategoryId: props.categoryId}
    }

    componentDidMount(){
        this.loadRoadmaps(this.state.CategoryId);
    }

    //ОПЦИОНАЛЬНО - ВЫРЕЗАТЬ
    async loadCategories(){
        var responce = await fetch(API_Controls.CategoriesList);

        if(responce.ok){
            var data = await responce.json();
            this.setState({Categories: data, isLoadingCategory:false});
            this.loadRoadmaps(data[0].id);
        }
    }

    //ОПЦИОНАЛЬНО - ВЫРЕЗАТЬ
    renderCategoryList(){
        const Hthis = this;
        var options = this.state.Categories.map(i => <option key={i.id} value={i.id}>{i.name}</option>)

        return(
            <select onChange={(e) => Hthis.loadRoadmaps(e.target.value)}>
                {options}
            </select>
        )
    }

    async loadRoadmaps(index){
        console.log(`loading roadmap by category ID = ${index}`);
        var responce = await fetch(GetElementFromAPI.GetRoadMapsByCategory(index));
        if(responce.ok){
            var data = await responce.json();
            this.state.parent.roadmapId = data[0].id;
            this.setState({Roadmaps:data, isLoading:false});
        }
    }

    renderRoadmapList(){
        var color = 'info';
        const Hthis = this;
        var roadmaps = this.state.Roadmaps.map(i => 
        <ListGroupItem key={i.id} color={color} tag={Button} onClick={(e) => 
            {
            Hthis.state.parent.onSelectRoadmap(i.id);
            }}>
                {i.name}
        </ListGroupItem>);

        return(
            <ListGroup horizontal>
                {roadmaps}
            </ListGroup>
        )
    }

    render(){
        var body =  this.state.isLoading ? "Loading..." : this.renderRoadmapList();

        return(
            <Container>
                {body}
            </Container>
        )
    }
}

export {RoadmapList}