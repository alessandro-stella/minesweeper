import React, { useEffect, useState } from "react";
import Cell from "./Cell";

import bombDark from "../img/bomb-dark.png";
import flagDark from "../img/flag-dark.png";

import bomb from "../img/bomb.png";
import flag from "../img/flag.png";
import backArrow from "../img/back-arrow.png";

function Grid(props) {
    const gridSizeX = props.gridSizeX;
    const gridSizeY = props.gridSizeY;
    const setIsGridShown = props.setIsGridShown;
    const setIsTitleShown = props.setIsTitleShown;
    const bombNumber = props.bombNumber;
    const setBombNumber = props.setBombNumber;

    const [clickedCells, setClickedCells] = useState(0);
    const [cells, setCells] = useState([]);
    const [hasStarted, setHasStarted] = useState(false);
    const [blockClick, setBlockClick] = useState(false);
    const [flagCounter, setFlagCounter] = useState(0);
    const [flagging, setFlagging] = useState(false);
    const [won, setWon] = useState(false);

    useEffect(() => {
        setCells(createMatrix);
    }, []);

    function getRandomNumber(max) {
        return Math.floor(Math.random() * max);
    }

    function getBombCells() {
        let gridCells = Array.from(document.getElementsByClassName("cell"));
        let bombCells = [];

        for (let i = 0; i < gridSizeY; i++) {
            for (let j = 0; j < gridSizeX; j++) {
                if (cells[i][j].isBomb) {
                    let output;

                    if (i === 0 && j === 0) {
                        output = gridCells[0];
                    }

                    if (i === 0 && j !== 0) {
                        output = gridCells[j];
                    }

                    if (i !== 0 && j === 0) {
                        output = gridCells[i * gridSizeX];
                    }

                    if (!output) {
                        output = gridCells[i * gridSizeX + j];
                    }

                    bombCells.push(output);
                }
            }
        }

        return bombCells;
    }

    function createBombs() {
        let bombIndex = [];

        for (let i = 0; i < bombNumber; i++) {
            let randomX;
            let randomY;
            let newIndex;

            do {
                randomX = getRandomNumber(gridSizeX);
                randomY = getRandomNumber(gridSizeY);

                newIndex = `${randomY}-${randomX}`;
            } while (bombIndex.includes(newIndex));

            bombIndex.push(newIndex);
        }

        return bombIndex;
    }

    function createMatrix() {
        let cellMatrix = [];
        let bombPositions = createBombs();

        for (let i = 0; i < gridSizeY; i++) {
            let row = [];

            for (let j = 0; j < gridSizeX; j++) {
                let value = `${i}-${j}`;

                let cell = {
                    index: value,
                    isBomb: bombPositions.includes(value) ? true : false,
                    checked: false,
                };

                row.push(cell);
            }

            cellMatrix.push(row);
        }

        return cellMatrix;
    }

    function showBombs() {
        let bombCells = getBombCells();

        for (let bombCell of bombCells) {
            bombCell.classList.remove("flagged");
            bombCell.classList.add("bomb");
        }
    }

    function countNeighbors(cellI, cellJ) {
        let counter = 0;

        for (let i = cellI - 1; i <= cellI + 1; i++) {
            for (let j = cellJ - 1; j <= cellJ + 1; j++) {
                if (i >= 0 && i < gridSizeY && j >= 0 && j < gridSizeX) {
                    if (
                        !(i === cellI && j === cellJ) &&
                        cells[i][j].isBomb === true
                    ) {
                        counter++;
                    }
                }
            }
        }

        return counter;
    }

    function setCellValue(index) {
        if (!hasStarted) {
            setHasStarted(true);
        }

        let [cellI, cellJ] = index.split("-").map(Number);
        recursiveCheck(cellI, cellJ);

        setCells([...cells]);
    }

    function recursiveCheck(cellI, cellJ) {
        if (typeof cells[cellI][cellJ] === "undefined") {
            return;
        }

        updateClickedCellsNumber("add");

        let neighborNumber = countNeighbors(cellI, cellJ);
        cells[cellI][cellJ].value = neighborNumber;
        cells[cellI][cellJ].checked = true;

        if (neighborNumber !== 0) {
            return;
        }

        for (let i = cellI - 1; i <= cellI + 1; i++) {
            for (let j = cellJ - 1; j <= cellJ + 1; j++) {
                if (i >= 0 && i < gridSizeY && j >= 0 && j < gridSizeX) {
                    if (!(i === cellI && j === cellJ)) {
                        if (cells[i][j].checked !== true) {
                            recursiveCheck(i, j);
                        }
                    }
                }
            }
        }
    }

    function removeBomb(index) {
        let [cellI, cellJ] = index.split("-").map(Number);
        cells[cellI][cellJ].isBomb = false;

        setBombNumber((bombNumber) => bombNumber - 1);
        setCells([...cells]);
    }

    function updateClickedCellsNumber(mode, flag) {
        if (mode === "add") {
            setClickedCells((clickedCells) => clickedCells + 1);

            if (flag) {
                setFlagCounter((flagCounter) => flagCounter + 1);
            }

            return;
        }

        setClickedCells((clickedCells) => clickedCells - 1);

        if (flag) {
            setFlagCounter((flagCounter) => flagCounter - 1);
        }
    }

    function checkResults() {
        if (
            clickedCells !== gridSizeX * gridSizeY ||
            flagCounter !== bombNumber
        ) {
            return;
        }

        let bombCells = getBombCells();
        let flaggedCells = Array.from(
            document.getElementsByClassName("flagged")
        );

        let checkResults = true;

        for (let i = 0; i < bombCells.length; i++) {
            if (!bombCells[i].isSameNode(flaggedCells[i])) {
                checkResults = false;
            }
        }

        if (!checkResults) {
            loseGame();
            return;
        }

        winGame();
    }

    function loseGame() {
        showBombs();
        setBlockClick(true);

        setTimeout(() => {
            setCells("");
        }, 2500);
    }

    function winGame() {
        setTimeout(() => {
            showBombs();
        }, 200);

        setTimeout(() => {
            setIsTitleShown(true);
            setWon(true);
            setCells("");
        }, 2500);
    }

    useEffect(() => checkResults(), [clickedCells]);

    useEffect(() => {
        if (cells === "") {
            setIsTitleShown(true);
        }
    }, [cells]);

    return (
        <>
            {cells && !won ? (
                <>
                    <div className="grid-container">
                        <div
                            className={`grid ${
                                blockClick || won ? "block-click" : ""
                            }`}
                            style={{
                                gridTemplateColumns: `repeat(${gridSizeX}, 1fr)`,
                                gridTemplateRows: `repeat(${gridSizeY}, 1fr)`,
                            }}>
                            {React.Children.toArray(
                                cells.map((row) => {
                                    return (
                                        <>
                                            {React.Children.toArray(
                                                row.map((cell) => {
                                                    return (
                                                        <Cell
                                                            {...cell}
                                                            loseGame={loseGame}
                                                            setCellValue={
                                                                setCellValue
                                                            }
                                                            hasStarted={
                                                                hasStarted
                                                            }
                                                            setHasStarted={
                                                                setHasStarted
                                                            }
                                                            removeBomb={
                                                                removeBomb
                                                            }
                                                            updateClickedCellsNumber={
                                                                updateClickedCellsNumber
                                                            }
                                                            isFlagging={
                                                                flagging
                                                            }
                                                            gridWidth={
                                                                gridSizeX
                                                            }
                                                        />
                                                    );
                                                })
                                            )}
                                        </>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="game-buttons">
                        <div className="container">
                            <div className="game-buttons__container">
                                <div
                                    className={`button ${
                                        !flagging ? "active" : ""
                                    }`}
                                    onClick={() => setFlagging(false)}>
                                    <img
                                        src={flagging ? bomb : bombDark}
                                        alt="Select cell"
                                    />
                                </div>
                                <div
                                    className={`button ${
                                        flagging ? "active" : ""
                                    }`}
                                    onClick={() => setFlagging(true)}>
                                    <img
                                        src={!flagging ? flag : flagDark}
                                        alt="Place flag"
                                    />
                                </div>

                                <div
                                    className="button"
                                    onClick={() => {
                                        setIsTitleShown(true);
                                        setIsGridShown(false);
                                    }}>
                                    <img src={backArrow} alt="Go back" />
                                </div>
                            </div>
                        </div>

                        <div className="bomb-counter">
                            <img src={bomb} />
                            {bombNumber - flagCounter >= 0
                                ? `: ${bombNumber - flagCounter}`
                                : `: 0`}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="text end-message">
                        {won
                            ? "Congratulations, you have won!"
                            : "You seem to have lost..."}
                    </div>

                    <div className="button-container">
                        <div
                            className="button end-game__button"
                            onClick={() => setIsGridShown(false)}>
                            play again
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Grid;
