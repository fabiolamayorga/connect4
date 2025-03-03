import React from "react";
import cn from "classnames";
import { connect } from "react-redux";
import { RootState } from "../reducers";
import { getBoard, getCurrentPlayer, getWinner, getNewBoard } from "../reducers/selectors";
import { Row } from "./Row";
import { dropCoin } from "../actions/dropCoin";
import { Color } from "../types";

interface Props {
  board: ReturnType<typeof getBoard>;
  color: ReturnType<typeof getCurrentPlayer>;
  winner: ReturnType<typeof getWinner>;
  newBoard: ReturnType<typeof getNewBoard>;
  dropCoin: typeof dropCoin;
}

export class BoardComponent extends React.Component<Props> {
  dropCoin = (column: number) => () => {
    // we only allow a player to drop a coin if there is no winner yet
    if (!this.props.winner) {
      this.props.dropCoin(column, this.props.color);
    }
  };

  displayHeader() {
    // only display the winner if there is one
    if (this.props.winner) {
      return <h2>Congratulations, {this.props.winner.color} wins the game!</h2>;
    } else {
      return <h2>It's {this.props.color}'s turn to play</h2>;
    }
  }

  displayRow = (colors: Color[], key: number) => {
    return (
      <Row
        row={key}
        dropCoin={this.dropCoin}
        colors={colors}
        key={`column-${key}`}
        winner={this.props.winner}
      />
    );
  };

  handleReset = (e:any) => {
    e.prevent.default();
    this.props.newBoard();
  }

  render() {
    const classes = cn("Game-Board");

    return (
      <>
        {this.displayHeader()}
        <div className="Game">
          <div className={classes}>{this.props.board.map(this.displayRow)}</div>
        </div>
        <div className="Game-controllers">
          <button onClick={this.handleReset}>{this.props.winner ? "Play Again" : "start over"}</button>
 
        </div>
      </>
    );
  }
}

const mapState = (state: RootState) => ({
  board: getBoard(state),
  color: getCurrentPlayer(state),
  winner: getWinner(state),
  newBoard: getNewBoard(),
});

export const Board = connect(mapState, { dropCoin })(BoardComponent);
