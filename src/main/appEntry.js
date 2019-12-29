import React, { Component } from "react";
import {  Table, Container, Input , ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText} from "reactstrap";
import { socket } from "../global/header";


class AppEntry extends Component{
    constructor(props){
        super(props);
        this.state ={
            id:'',
            name:'',
            theme:'',
            status:'',
            logs: []
        };
    }


    loadApp = data=>{
        this.setState({id: data[0][0].id, name: data[0][0].name, theme: data[0][0].theme, status: data[0][0].status, logs: data[1]});
        console.log("recieved application data, testing new state: ");
        console.log(this.state.logs);
    };

    logsUpdate = data =>{
        this.setState({logs: data});
        console.log("logs updated");
    };

        componentDidMount(props){
        socket.emit("reqApp", this.props.match.params.id);
        console.log("sending applications request with id: "+ this.props.match.params.id);
        socket.on("resApp", this.loadApp);
        socket.on("logsUpdate", this.logsUpdate);
    }

    componentWillUnmount(){
        socket.off("resApp");
        socket.off("logsUpdate");
    }

    logsInsert(){
        return this.state.logs.map(d=>{
            var time = d.date.toString().slice(0,16);
            return(
                <tr>
                    <td>{d.message}</td>
                    <td>{time}</td>
                </tr>
            )
        });
    }

    render() {
        var d=this.state;
        return (
            <Container>
                <div>
                    <h2>Заявка с кодом {this.props.match.params.id} </h2>
                    {this.state.id!='' ? <Application data={d}/> : null}
                </div>
                <div>
                    <Table>
                        <thead>
                            <tr>
                                <th>Сообщение</th>
                                <th>Дата</th>
                            </tr>
                        </thead>
                        {this.logsInsert()}
                    </Table>
                </div>
            </Container>
        );
    }
}

class Application extends Component{
    constructor(props){
        super(props);
        this.state ={
            id: props.data.id,
            name: props.data.name,
            theme: props.data.theme,
            status: props.data.status
        };
    }
    updateStatus= event => {
        var msg = {
            id: this.state.id,
            status: event.target.value
        };
        socket.emit("updateStatus", msg);
        this.setStatus(msg);
        console.log("status update sent");
    };
    setStatus = data =>{
        console.log("status update");
        if(this.state.id == data.id)
        this.setState({status: data.status});
    };
    componentDidMount(){
        socket.on("statusUpdated", this.setStatus);
    }
    componentWillUnmount(){
        socket.off("statusUpdated");
    }
    render(){
        return(
            <Container>
                <div>
                    <ListGroup>
                        <ListGroupItem>
                            <ListGroupItemHeading>Имя участника:</ListGroupItemHeading>
                            <ListGroupItemText>{this.state.name} </ListGroupItemText>
                        </ListGroupItem>
                        <ListGroupItem>
                            <ListGroupItemHeading>Тема работы:</ListGroupItemHeading>
                            <ListGroupItemText>{this.state.theme} </ListGroupItemText>
                        </ListGroupItem>
                        <ListGroupItem>
                            <ListGroupItemHeading>ID работы:</ListGroupItemHeading>
                            <ListGroupItemText>{this.state.id}</ListGroupItemText>
                        </ListGroupItem>
                        <ListGroupItem>
                            <ListGroupItemHeading>Статус работы:</ListGroupItemHeading>
                            <ListGroupItemText>
                                <Input type="select" name="select" onChange={this.updateStatus} value={this.state.status} size="1">
                                    <option value="approved">approved</option>
                                    <option value='not approved'>not approved</option>
                                </Input>
                            </ListGroupItemText>
                        </ListGroupItem>
                    </ListGroup>
                </div>
            </Container>
        )
    }
}

export default AppEntry;