import './App.css';
import { Layout } from './Layout';
import { Home } from './Components/Home';
import { EditView } from './Components/EditView';
import {Routes, Route, useParams} from "react-router-dom";
import {CategoryRoute } from './Constants/Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row } from 'reactstrap';


function App() {
  return (
    <div className="App">
      <header>
        <Layout/>
      </header>
      <Routes>
        <Route path='/' element={<Home text="Home page component"/>}/>
        <Route path='/about' element={<Home text="About page component"/>}/>
        <Route path='/moderation' element={<EditView text="Moderation page component"/>}/>
        <Route path='/category/:id' element={<CategoryRoute />}/>
      </Routes>
      <footer>
        <Row>
          <Col>
            <b>Наши соц. сети</b>
          </Col>
          <Col>
            <b>Контакты</b>
          </Col>
          <Col>
            <b>Юридический адрес</b>
          </Col>
        </Row>
      </footer>
    </div>
  );
}

export default App;
