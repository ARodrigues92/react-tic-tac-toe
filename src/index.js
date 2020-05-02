import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function SortButton(props) {
  return (
    <button className="sort" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function ReverseButton(props) {
  return (
    <button className={props.className} onClick={props.onGoToClick}>
      {props.desc}
    </button>
  );
}

function Cooredinates(props) {
  return <p className={props.className}>{props.coordMsg}</p>;
}

function GameHistory(props) {
  let moves = props.history.map((step, move) => {
    const desc = move ? 'Go to move #' + move : 'Go to game start';
    const coordMsg = step.playLocation
      ? 'Move coordinates (col-row): ' + step.playLocation
      : '';
    const className = move === props.history.length - 1 ? 'bold' : '';
    return (
      <li key={move}>
        <ReverseButton
          className={className}
          desc={desc}
          onGoToClick={() => props.onGoToClick(move)}
        />
        <Cooredinates className={className} coordMsg={coordMsg} />
      </li>
    );
  });
  if (!props.isAscending) {
    moves = moves.reverse();
  }
  return <ul>{moves}</ul>;
}

class GameData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAscending: true,
    };
  }

  handleClick() {
    this.setState({
      isAscending: this.state.isAscending ? false : true,
    });
  }

  render() {
    const buttonMsg = this.state.isAscending
      ? 'Sort last to first'
      : 'Sort first to last';
    return (
      <div>
        <div>
          <SortButton value={buttonMsg} onClick={() => this.handleClick()} />
        </div>
        <div>
          <GameHistory
            history={this.props.gameHistory}
            isAscending={this.state.isAscending}
            onGoToClick={(move) => this.props.onGoToClick(move)}
          />
        </div>
      </div>
    );
  }
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i.toString()}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createBoard() {
    let board = [];
    let counter = 0;

    for (let i = 0; i < 3; i++) {
      let squares = [];

      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(counter));
        counter += 1;
      }

      board.push(
        <div key={i.toString()} className="board-row">
          {squares}
        </div>
      );
    }
    return board;
  }

  render() {
    return <div>{this.createBoard()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          playLocation: '',
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const col = Math.floor(i % 3);
    const row = Math.floor(i / 3);

    const cooredinates = col + '-' + row;

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        { squares: squares, playLocation: cooredinates },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <GameData
            gameHistory={history}
            onGoToClick={(move) => this.jumpTo(move)}
          />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
