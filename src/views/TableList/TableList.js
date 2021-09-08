import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Hr from "../../assets/data/HR.json";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);
export default function TableList() {
  const [deptSelected, setDeptSelected] = useState(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    setDeptSelected(window.localStorage.getItem("department"));
  });

  useEffect(() => {
    fetch("https://randomuser.me/api/?seed=" + deptSelected + "&results=10")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setPeople(sortJson(result));
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [deptSelected]);

  function sortJson(result) {
    let tempPeopleArray = [];
    for (let i = 0; i < result.results.length; i++) {
      let entry = {
        id: i,
        name: result.results[i].name.first + " " + result.results[i].name.last,
        email: result.results[i].email,
        mobile: result.results[i].cell,
        age: result.results[i].dob.age,
        city: result.results[i].location.city,
        country: result.results[i].location.country,
      };
      tempPeopleArray.push(entry);
    }
    return tempPeopleArray;
  }

  function handleChange(value) {
    setDeptSelected(value);
    window.localStorage.setItem("department", value);
  }

  const classes = useStyles();
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Simple Table</h4>
              <p className={classes.cardCategoryWhite}>
                Here is a subtitle for this table
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["Departments"]}
                tableData={Hr.departments.map((depts) => [
                  <label key={depts.id}>
                    <input
                      type="radio"
                      value={depts.department}
                      checked={deptSelected === depts.department}
                      onChange={() => handleChange(depts.department)}
                    />
                    {depts.department}
                  </label>,
                ])}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card plain>
            <CardHeader plain color="primary">
              <h4 className={classes.cardTitleWhite}>
                Table on Plain Background
              </h4>
              <p className={classes.cardCategoryWhite}>
                Here is a subtitle for this table
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={[
                  "Name",
                  "Age",
                  "Mobile",
                  "Email",
                  "City",
                  "Country",
                ]}
                tableData={people.map((person) => [
                  <p key={person.id}>{person.name}</p>,
                  <p key={person.id}>{person.age}</p>,
                  <p key={person.id}>{person.mobile}</p>,
                  <p key={person.id}>{person.email}</p>,
                  <p key={person.id}>{person.city}</p>,
                  <p key={person.id}>{person.country}</p>,
                ])}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}
