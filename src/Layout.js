import React, { Component } from "react";
import { Link } from "react-router-dom";
    import {
        Collapse,
        Navbar,
        NavbarToggler,
        NavbarBrand,
        Nav,
        NavItem,
        NavLink,
        UncontrolledDropdown,
        DropdownToggle,
        DropdownMenu,
        DropdownItem,
        NavbarText,
      } from 'reactstrap';
import { LoadCategories } from "./Constants/Paths";

    class Layout extends Component
    {
        constructor(params)
        {
            super(params);
            this.state = {isOpen : false, DropdownItems: [], loadingItems: true};
        }

        static toggle(caller){
            caller.setState ({isOpen : !(caller.state.isOpen)});
        }

        componentDidMount(){
            this.getCategories();

        }

        async getCategories(){
            var data = await LoadCategories();
            console.log(data);
            const DropdownItems = data.map(i =>
                
                    <DropdownItem key={i.id}><NavItem><NavLink href={`/category/${i.id}`}>{i.name}</NavLink></NavItem></DropdownItem>
                );

            this.setState({DropdownItems: DropdownItems, loadingItems: false});
            return ;
        }

        render(){
            
            const Hthis = this;
            const DropdownItems = this.state.loadingItems ? "Loading" : this.state.DropdownItems;
            return(
                <Navbar color="dark" dark expand="md" container="fluid">
                    <NavbarBrand href="/" >EasyRoadmaps</NavbarBrand>
                    <NavbarToggler onClick={() => Layout.toggle(Hthis)} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="me-auto" horizontal="end" navbar>
                        <NavItem>
                            <NavLink href="/" >Главная</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/moderation" >
                                Модерация
                            </NavLink>
                        </NavItem>
                        <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            <b>Дорожные карты</b>
                        </DropdownToggle>
                        <DropdownMenu dark>
                            {DropdownItems}
                        </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                    <NavbarText>
                        <NavLink href="/about">
                            О нас
                        </NavLink>
                    </NavbarText>
                    </Collapse>
                </Navbar>
            )
        }
        
    }

    export {Layout}