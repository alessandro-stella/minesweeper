import React, { useState, useEffect } from "react";

function Cell(props) {
    const [value, setValue] = useState(props.value);
    const [isClicked, setIsClicked] = useState(props.value ? true : false);
    const [isFlagged, setIsFlagged] = useState(false);
    const [hasExploded, setHasExploded] = useState(false);

    const index = props.index;
    const gridWidth = props.gridWidth;
    const borderRight = isRight();
    const isBomb = props.isBomb;
    const isFlagging = props.isFlagging;
    const removeBomb = props.removeBomb;
    const hasStarted = props.hasStarted;
    const loseGame = props.loseGame;
    const setCellValue = props.setCellValue;
    const updateClickedCellsNumber = props.updateClickedCellsNumber;

    function isRight() {
        let [cellI, cellJ] = index.split("-").map(Number);

        if ((cellJ + 1) / gridWidth === 1) {
            return true;
        } else {
            return false;
        }
    }

    function handleClick(rightClick) {
        if (isClicked) {
            return;
        }

        if (isFlagging || rightClick === true) {
            if (isClicked) {
                return;
            }

            setIsFlagged((isFlagged) => !isFlagged);

            if (isFlagged) {
                updateClickedCellsNumber("remove", "flag");
            } else {
                updateClickedCellsNumber("add", "flag");
            }

            return;
        }

        if (isFlagged) {
            return;
        }

        if (isBomb) {
            if (hasStarted) {
                setHasExploded(true);
                loseGame();
                return;
            }

            removeBomb(index);
        }

        setIsClicked(true);
        setIsFlagged(false);
        setCellValue(index);
    }

    function handleRightClick(e) {
        e.preventDefault();

        if (isClicked) {
            return;
        }

        handleClick(true);
    }

    useEffect(() => {
        setValue(props.value);

        if (typeof props.value !== "undefined") {
            setIsClicked(true);
        }
    }, [props.value]);

    return (
        <div
            className={
                `cell ${isClicked ? "clicked" : ""} ${
                    value ? `value${value}` : ""
                } ${isFlagged && !isClicked ? "flagged" : ""} ${
                    borderRight ? "border-right" : ""
                } ${
                    hasExploded ? "exploded" : ""
                }` /* ${isBomb ? "bomb" : ""} */
            }
            onClick={handleClick}
            onContextMenu={(e) => handleRightClick(e)}>
            <div className="cell-value">
                {value !== null && value !== 0 && value}
            </div>
        </div>
    );
}

export default Cell;
