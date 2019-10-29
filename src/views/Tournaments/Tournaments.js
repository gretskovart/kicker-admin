import React, { Component } from "react";
import { observer } from "mobx-react";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CircularProgress  from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import Create from "@material-ui/icons/Create";
import Delete from "@material-ui/icons/Delete";
import MaterialTable from "material-table";
import { styles } from "./Tournaments.styles";
import { store } from "../../store/tournamentStore";
import dateFormat from "dateformat";
import { withRouter } from "react-router-dom";
import TournamentAddForm from "./TournamentAddForm";

@withRouter
@observer
class Tournaments extends Component {
  constructor(props) {
    super(props);
    this.tableConfig = {
      actions: [
        {
          icon: () => {
            return (
            <Button
              color="primary"
              startIcon={
                <AddCircleOutline
                  color="primary"
                />
              }
            >
              Add new tournament
            </Button>
          )},
          tooltip: "Add Tournament",
          isFreeAction: true,
          onClick: this.handleOpen
        },
        {
          icon: Create,
          tooltip: "Edit Tournament",
          onClick: () => {}
        },
        {
          icon: Delete,
          tooltip: "Delete Tournament",
          onClick: () => {}
        }
      ],
      columns: [
        { title: "№", field: "number" },
        { title: "Title", field: "title" },
        { title: "Start Date", field: "startDate", type: "date" },
        { title: "Finish Date", field: "endDate", type: "date" },
        { title: "Status", field: "status" },
      ],
      localization: {
        body: {
          emptyDataSourceMessage: "There are no tournaments yet"
        }
      },
      options: {
        actionsColumnIndex: -1,
        draggable: false,
        paging: false,
        search: false,
        showTitle: false,
        sorting: false,
        toolbarButtonAlignment: "left"
      }
    }
    this.state = {
      isLoading: true,
      open: false
    };
  }

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  handleOpen = () => {
    this.setState({
      open: true
    });
  };

  async loadTournamentsIfNeeded() {
    try {
      this.setState({ isLoading: true });
      await store.getTournaments();
    } finally {
      this.setState({ isLoading: false });
    }
  }

  componentDidMount() {
    this.loadTournamentsIfNeeded();
  }

  render() {
    const { classes } = this.props;

    if (this.state.isLoading) {
      return <CircularProgress className={classes.circularProgress} />;
    }

    return (
      <React.Fragment>
        <Container
          className={classes.container}
        >
          <div style={{ overflowX: "auto" }}>
            <MaterialTable
              { ...this.tableConfig }
              data={
                store.tournaments.map((tour, index) => (
                  {
                    number: ++index,
                    title: tour.title,
                    startDate: dateFormat(tour.startDate, "dddd, mmmm dS, yyyy"),
                    endDate: dateFormat(tour.endDate, "dddd, mmmm dS, yyyy")
                  }
                ))
              }
            />
          </div>
          {this.state.open && (
            <TournamentAddForm
              handleClose={this.handleClose}
              open={this.state.open}
            />
          )}
        </Container>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Tournaments);
