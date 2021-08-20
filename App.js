import React from "react";
import { Container, Row, Form, FormGroup, FormControl, FormLabel, Button, Alert, Table } from "react-bootstrap";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      id:"",
			name: "",
      address: "",
      age:"",
     
			records: [],
			showAlert: false,
			alertMsg: "",
			alertType: "success",
			//id: "",
			update: false,
		};
	}

	handleChange = (evt) => {
		this.setState({
      [evt.target.id]: evt.target.value,
      [evt.target.name]: evt.target.value,
      [evt.target.age]: evt.target.value,
      [evt.target.address]: evt.target.value,
		});
	};

	componentWillMount() {
		this.fetchAllRecords();
	}

	// add a record
	//var url = 'https://cors-anywhere.herokuapp.com/http://sipla.cuci.udg.mx/sc/horariop.php?c=219359735&k=0d8ce4fab5f4df9ce711cae81e044e1a';
	addRecord = () => {
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		//myHeaders.append("Access-Control-Allow-Origin", "*");

		var body = JSON.stringify({ id:this.state.id,name: this.state.name, age: this.state.age, address: this.state.address });
		fetch("http://localhost:8080/api/create", {
			//mode: 'no-cors',
			method: "POST",
			headers: myHeaders,
			body: body,
		})
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				this.setState({
          id:"",
		 name: "",
          age: "",
          address:"",
					showAlert: true,
					alertMsg: result.response,
					alertType: "success",
				});
			});
	};

	// fetch All Records
	fetchAllRecords = () => {
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		//myHeaders.append("Access-Control-Allow-Origin", "*");
		fetch("http://localhost:8080/api/view", {
			//mode: 'no-cors',
			method: "GET",
			//headers: headers,
		})
			.then((response) => response.json())
			.then((result) => {
				console.log("result", result);
				this.setState({
					records: result.response,
				});
			})
			.catch((error) => console.log("error", error));
	};

	// view single data to edit
	editRecord = (id) => {
		fetch("http://localhost:8080/api/view/" + id, {
			//mode: 'no-cors',
			method: "GET",
		})
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				this.setState({
					id: id,
          update: true,
          //id: result.response[0].id,
					name: result.response[0].name,
          age: result.response[0].age,
          address: result.response[0].address,
				});
			})
			.catch((error) => console.log("error", error));
	};

	// update record
	updateRecord = () => {
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		//myHeaders.append("Access-Control-Allow-Origin", "*");
		var body = JSON.stringify({ id: this.state.id, name: this.state.name, age: this.state.age ,address: this.state.address });
		fetch("http://localhost:8080/api/update", {
			//mode: 'no-cors',
			method: "PUT",
			headers: myHeaders,
			body: body,
		})
			.then((response) => response.json())
			.then((result) => {
				this.setState({
					showAlert: true,
					alertMsg: result.response,
					alertType: "success",
					update: false,
					id: "",
					name: "",
                    age: "",
                    address:""
				});
				this.fetchAllRecords();
			})
			.catch((error) => console.log("error", error));
	};

	// delete a record
	deleteRecord = (id) => {
		fetch("http://localhost:8080/api/delete/" + id, {
			//mode: 'no-cors',
			method: "DELETE",
		})
			.then((response) => response.json())
			.then((result) => {
				this.setState({
					showAlert: true,
					alertMsg: result.response,
					alertType: "danger",
				});
				this.fetchAllRecords();
			})
			.catch((error) => console.log("error", error));
	};
	render() {
		return (
			<div>
				<Container>
					{this.state.showAlert === true ? (
						<Alert
							variant={this.state.alertType}
							onClose={() => {
								this.setState({
									showAlert: false,
								});
							}}
							dismissible
						>
							<Alert.Heading>{this.state.alertMsg}</Alert.Heading>
						</Alert>
					) : null}

					{/* All Records */}
					<Row>
						<Table striped bordered hover size="sm">
							<thead>
								<tr>
									<th>id</th>
									<th>Name</th>
									<th>age</th>
                  <th>address</th>
									<th colSpan="4">Actions</th>
								</tr>
							</thead>
							<tbody>
								{this.state.records.map((record) => {
									return (
										<tr>
											<td>{record.id}</td>
											<td>{record.name}</td>
											<td>{record.age}</td>
                      <td>{record.address}</td>
											<td>
												<Button variant="info" onClick={() => this.editRecord(record.id)}>
													Edit
												</Button>
											</td>
											<td>
												<Button variant="danger" onClick={() => this.deleteRecord(record.id)}>
													Delete
												</Button>

											</td>
										</tr>
									);
								})}
							</tbody>
						</Table>
					</Row>

					{/* Insert Form */}
					<Row>
						<Form>
							<FormGroup>
								<FormLabel>Enter the id</FormLabel>
								<FormControl type="number" name="id" placeholder="Enter the id" onChange={this.handleChange} value={this.state.id}></FormControl>
							</FormGroup>
              <FormGroup>
              <FormLabel>Enter the name</FormLabel>
								<FormControl type="text" name="name" placeholder="Enter the name" onChange={this.handleChange} value={this.state.name}></FormControl>
							</FormGroup>
							<FormGroup>
								<FormLabel>Enter the age </FormLabel>
								<FormControl type="number" name="age" value={this.state.age} onChange={this.handleChange} placeholder="Enter the age"></FormControl>
							</FormGroup>
              <FormGroup>
              <FormLabel>Enter the address</FormLabel>
								<FormControl type="text" name="address" placeholder="Enter the address" onChange={this.handleChange} value={this.state.address}></FormControl>
							</FormGroup>

							{this.state.update === true ? <Button onClick={this.updateRecord}>update</Button> : <Button onClick={this.addRecord}>Save</Button>}
						</Form>
					</Row>
				</Container>
			</div>
		);
	}
}

export default App;