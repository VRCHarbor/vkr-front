import React, { Component } from 'react';
import "./MDImage.css"
import {
    Button,
    ButtonGroup,
    Container,
    Col,
    Row,
    Input,
    Form,
    ListGroup,
    List,
    ListGroupItem
} from "reactstrap";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from 'rehype-highlight';
import {API_Controls, GetElementFromAPI, PostElementToAPI} from "../Constants/Paths";
import gfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex  from 'rehype-katex';


class EditView extends Component
{
    constructor(params){
        super(params);
        this.state = {
            text:"",
            isLoading:true,
            isLoadingCategories:true,
            isLoadingRoadmaps:true,
            isLoadingElements:true,
            SelectedRoadmapId:0,
            SelectedElementId:0,
            Categories:[],
            images:[],
            Roadmaps:[],
            Elements:[],
        };
    }

    updateText(text){
        this.setState({text:text});
    }

    async deleteImage(arg){
        await fetch(`${API_Controls.Image}/${arg}`, {method:'DELETE'});

        this.setState({isLoading: true});
    }

    async getImages(){
        var responce = await fetch(`${API_Controls.Image}`);
        
        var data = await responce.json();
        var ids = data.ids;
        let imgArr = [];

        for(const item in ids){
            if(item % 4 == 0){
                imgArr.push(<hr/>);
            }
            imgArr.push(
            <Col key={ids[item]} xs={3} >
                <img src={ `${API_Controls.Image}/${ids[item]}`} width={"250"} /><br/>
                <ButtonGroup>
                <Button  type='submit' color='danger' onClick={(e) => this.deleteImage(ids[item])}>🗑️</Button>
                <Button color='secondary'>✏️</Button>
                </ButtonGroup>
            </Col>);
        }
        imgArr.push(<hr/>);
        this.setState({isLoading: false, images: imgArr})
    }

    async onImagePasting(img){
        img.preventDefault();
        
        var input = img.target[0];
        var files = input.files;
        var body = new FormData();
        
        for(const item in files){
            body.append("img", [files[item]]);
        }

        var responce = await fetch(`${API_Controls.Image}/many`, {
            body,
            method: 'POST',
            headers:
            {'Content-Type':  'multipart/form-data'},
        });
    }

    async loadCategories(){

        var responce = await fetch(API_Controls.CategoriesList);

        if(responce.ok){
            var data = await responce.json();
            this.setState({Categories:data, isLoadingCategories:false});
        }
    }

    async loadRoadmaps(categoryId){
        var responce = await fetch(GetElementFromAPI.GetRoadMapsByCategory(categoryId));

        if(responce.ok){
            var data = await responce.json();
            this.setState({Roadmaps:data, isLoadingRoadmaps: false});
        }
    }

    async loadElements(roadmapId){
        var responce = await fetch(GetElementFromAPI.GetRoadMap(roadmapId));

        if(responce.ok){
            var data = await responce.json();
            if(data.elements.length > 0){
                await this.renderTextFromElement(data.elements[0].id);
                this.setState({Elements:data.elements, isLoadingElements: false, SelectedElementId: data.elements[0].id});
            }
            else{
                this.setState({Elements:data.elements, isLoadingElements: false, text: ''});
            }
        }
    }

    async addNewCategory(name){

        var responce = await fetch(PostElementToAPI.PostNewRoadmapCategory(name), {method: 'POST'});

        if(responce.ok){
            this.setState({isLoadingCategories: true});
        }
    }

    async addRoadmapToCategory(categoryId, Name){
        var responce = await fetch(PostElementToAPI.PostNewRoadmap(categoryId, Name), {method:'POST'});
        
        if(responce.ok){
            this.setState({isLoadingRoadmaps: true});
        }
    }

    async addElementToCurrentRoadmap(roadmapId, Title){

        var responce = await fetch(PostElementToAPI.PostNewElement(roadmapId, Title), {method:'POST'});
        
        if(responce.ok){
            this.setState({isLoadingElements: true});
        }
    }

    async editElementContent(ElementId){

        var formaData = new FormData();
        formaData.append('content', this.state.text);
        var responce = await fetch(PostElementToAPI.PatchElementContent(ElementId),
            {
                method:'PATCH',
                body:formaData,
            });

        if(responce.ok){

        }
    }

    async deleteElement(elementId){
        const responce = await fetch(GetElementFromAPI.GetRoadMapElement(elementId), {method:'DELETE'});

        if(responce.ok){
            this.loadElements(this.state.SelectedRoadmapId);
        }
    }

    async deleteRoadmap(roadmapId){
        const responce = await fetch(GetElementFromAPI.GetRoadMap(roadmapId), {method:'DELETE'});

        if(responce.ok){
            this.loadRoadmaps(this.state.Categories[0].id);
        }   
    }

    async deleteCategory(categoryId){
        const responce = await fetch(GetElementFromAPI.GetRoadMapCategory(categoryId), {method:'DELETE'});

        if(responce.ok){
            this.loadCategories();
        }
    }

    async renderTextFromElement(ElementId){
        var responce = await fetch(GetElementFromAPI.GetRoadMapElement(ElementId));

        if(responce.ok){
            var data = await responce.json();

            this.setState({text: data.content});
        }
    }

    renderCategories(){

        const options = this.state.Categories.map(i =>
            <option key={i.id} value={i.id}>
                {i.name}
            </option>);
    
        return(options);
    }

    renderRoadmaps(){

        const Items = this.state.Roadmaps.map(i =>
                <ButtonGroup vertical >
                    <Button 
                            color='info'
                            onClick={()=>{
                                this.state.SelectedRoadmapId = i.id
                                this.loadElements(i.id);
                                }}>
                        {i.name}
                    </Button>
                    <Button 
                    onClick={()=>{
                        this.deleteRoadmap(i.id);
                    }}
                    color='danger'>
                        <Button close/>
                    </Button>
                </ButtonGroup>
        );

        return(
            <ButtonGroup horizontal >
                {Items}
            </ButtonGroup>
        );
    }

    renderElements(){

        if(this.state.Elements.length !=0){
            const Items = this.state.Elements.map(i => 
                <div>
                    <Button 
                    onClick={()=>{
                    this.state.SelectedElementId = i.id
                    this.renderTextFromElement(i.id);
                    }}>
                    {i.title}
                    </Button>
                    <br/>
                    <Button 
                    onClick={()=> {
                        this.deleteElement(i.id);
                    }}
                    color='danger'>
                    <Button close/>
                    </Button>
                </div>
            );
            return(
                <ButtonGroup horizontal>
                    {Items}
                </ButtonGroup>
            )
        }
        return ("Empty");

    }

    render(){
        const Hthis = this;

        const imageView = this.state.isLoading ? "loading..." : this.state.images;
        const CategoryOptions = this.state.isLoadingCategories ? [<option key={0} value={0}/>] : this.renderCategories();
        const Roadmaps = this.state.isLoadingRoadmaps ? <p>"loading..."</p> : this.renderRoadmaps();
        const Elements = this.state.isLoadingElements ? <p>"loading..."</p> : this.renderElements();

        if(this.state.isLoading){
            this.getImages();
        }
        if(this.state.isLoadingCategories){
            this.loadCategories();
        }
        if(this.state.isLoadingRoadmaps && this.state.Categories.length != 0){
            this.loadRoadmaps(this.state.Categories[0].id);
        }
        if(this.state.isLoadingElements && this.state.Roadmaps.length != 0){
            this.loadElements(this.state.Roadmaps[0].id);
        }

        const addCategoryBlock = (
            <Row>
                <Form  target="hiddenframe" onSubmit={(e) => {e.preventDefault(); Hthis.addNewCategory(e.target.name.value)}}>
                <Col>
                    <Input name='name' type='text'/>
                    <Button type='submit' color="primary">Add Category</Button>
                </Col>
                </Form>
            </Row>
        );

        const CategorySelect = (
            <select name='category'>
                {CategoryOptions}
            </select>
        );

        const CategorySelectForRoadmaps = (
            <select name='category' type='select' onChange={(e) => {Hthis.loadRoadmaps(e.target.value)}} >
                {CategoryOptions}
            </select>
        );
        
        const addRoadmapToSelectedCategoryBlock =(
            <Row>
                <Col>
                    <Form method="POST" onSubmit={
                        (e) => {
                            e.preventDefault();
                            Hthis.addRoadmapToCategory(
                            e.target.category.value,
                            e.target.name.value
                        )}}>
                        {CategorySelect}
                        <Input name='name' type='text'/>
                        <Button color="primary" type='submit'>Add roadmap to selected category</Button>
                    </Form>
                </Col>
            </Row>
        );

        const addElementToCurrentRoadmapBlock =(
            <Row>
                <Col>
                    <Form method="POST" onSubmit={
                        (e) => {
                            e.preventDefault();
                            Hthis.addElementToCurrentRoadmap(
                            Hthis.state.SelectedRoadmapId,
                            e.target.title.value
                        )}}>
                        <Input name='title' type='text'/>
                        <Button color="primary" type='submit'>Add element to selected roadmap</Button>
                    </Form>
                </Col>
            </Row>
        )


        return(
        <div className='h-auto'>
            <Container className='h-100'>
                {addCategoryBlock}
                <hr/>
                {addRoadmapToSelectedCategoryBlock}
                <hr/>
                {CategorySelectForRoadmaps}<br/>
                {Roadmaps}<br/>
                {Elements}
                {addElementToCurrentRoadmapBlock}
                <Row className='h-100'>
                <Col xs={6}>
                    <Input type="textarea" name="text" id="exampleText" 
                    className='w-100'
                    value={this.state.text}
                    onChange={(e) => {Hthis.updateText(e.target.value)}}
                    style={{minHeight: '100%'}}
                    />
                </Col>
                <Col xs={6}>
                    <ReactMarkdown
                    remarkPlugins={[remarkMath, gfm]}
                    rehypePlugins={[rehypeKatex]}
                    className='md-container'
                    >
                        {this.state.text}
                    </ReactMarkdown>
                </Col>
                </Row>
                <Row>
                    <iframe name="hiddenFrame" hidden/>        
                <Form method='POST' encType='multipart/form-data' action={`${API_Controls.Image}/many`} target="hiddenFrame">
                    <Input type='file' name='img' accept="image/png, image/gif, image/jpeg" multiple/>
                    <Button color="primary" type='submit'>Load images</Button>
                </Form>
                <Button color="success" className='float-sm-right' onClick={() => {Hthis.editElementContent(Hthis.state.SelectedElementId)}}>Save</Button>
                </Row>
                <hr/>
                <Row>
                    {imageView}
                </Row>
            </Container>
            
        </div>);
    }
}

export {EditView}