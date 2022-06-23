import Grid from "./components/Grid.jsx";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
    const [isGridShown, setIsGridShown] = useState(false);
    const [gridSizeX, setGridSizeX] = useState(6);
    const [gridSizeY, setGridSizeY] = useState(6);
    const [difficulty, setDifficulty] = useState("easy");
    const [isSquared, setIsSquared] = useState(true);
    const [bombNumber, setBombNumber] = useState(getBombNumber());
    const [isTitleShown, setIsTitleShown] = useState(true);

    function incrementSize(mode) {
        if (mode === "x") {
            setGridSizeX((gridSizeX) => gridSizeX + 1);

            if (isSquared) {
                setGridSizeY((gridSizeY) => gridSizeX + 1);
            }

            return;
        }

        setGridSizeY((gridSizeY) => gridSizeY + 1);
    }

    function decrementSize(mode) {
        if (mode === "x") {
            if (gridSizeX - 1 !== 5) {
                setGridSizeX((gridSizeX) => gridSizeX - 1);
            }

            if (isSquared) {
                if (gridSizeX - 1 !== 5) {
                    setGridSizeY((gridSizeY) => gridSizeX - 1);
                }
            }

            return;
        }

        if (gridSizeY - 1 !== 5) {
            setGridSizeY((gridSizeY) => gridSizeY - 1);
        }
    }

    function changeGridMode(mode) {
        if (mode === "squared") {
            setIsSquared((isSquared) => (isSquared = true));
            setGridSizeY((gridSizeY) => (gridSizeY = gridSizeX));
            return;
        }

        setIsSquared((isSquared) => (isSquared = false));
    }

    function getBombMultiplier() {
        switch (difficulty) {
            case "easy":
                return 7;

            case "normal":
                return 6;

            case "hard":
                return 5;

            default:
                break;
        }
    }

    function getBombNumber() {
        return Math.round((gridSizeX * gridSizeY) / getBombMultiplier());
    }

    useEffect(() => {
        setBombNumber((bombNumber) => getBombNumber());
        setIsTitleShown(true);
    }, [difficulty, gridSizeX, gridSizeY]);

    useEffect(() => {
        setBombNumber((bombNumber) => getBombNumber());
    }, [isGridShown]);

    return (
        <>
            {isTitleShown && <div className="title">Minesweeper</div>}

            {!isGridShown ? (
                <>
                    <div className="grid-settings-container">
                        <div className="text section-title">
                            Impostazioni griglia
                        </div>

                        <div className="size-container">
                            <div className="text">
                                Numero{" "}
                                {isSquared ? "righe e colonne:" : "colonne: "}
                            </div>

                            <div className="button-container">
                                <div
                                    className={`button ${
                                        gridSizeX !== 6 ? "active" : "disabled"
                                    }`}
                                    onClick={() => decrementSize("x")}>
                                    -
                                </div>
                                <div className="size-value">{gridSizeX}</div>
                                <div
                                    className="button active"
                                    onClick={() => incrementSize("x")}>
                                    +
                                </div>
                            </div>
                        </div>

                        {!isSquared && (
                            <div className="size-container">
                                <div className="text">Numero righe:</div>

                                <div className="button-container">
                                    <div
                                        className={`button ${
                                            gridSizeY !== 6 ? "active" : ""
                                        }`}
                                        onClick={() => decrementSize("y")}>
                                        -
                                    </div>
                                    <div className="size-value">
                                        {gridSizeY}
                                    </div>
                                    <div
                                        className="button active"
                                        onClick={() => incrementSize("y")}>
                                        +
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="text section-title">
                            Dimensioni griglia: {gridSizeX}x{gridSizeY}
                        </div>

                        <div className="size-container">
                            <div
                                className={`button ${
                                    isSquared ? "active" : ""
                                }`}
                                onClick={() => changeGridMode("squared")}>
                                QUADRATA
                            </div>
                            <div
                                className={`button ${
                                    !isSquared ? "active" : ""
                                }`}
                                onClick={() => changeGridMode("rectangular")}>
                                RETTANGOLARE
                            </div>
                        </div>
                    </div>

                    <div className="difficulty-container">
                        <div className="text section-title">
                            Seleziona la difficolta'
                        </div>

                        <div className="difficulty-buttons">
                            <div
                                className={`button ${
                                    difficulty === "easy" ? "active" : ""
                                }`}
                                onClick={() =>
                                    setDifficulty(
                                        (difficulty) => (difficulty = "easy")
                                    )
                                }>
                                Facile
                            </div>

                            <div
                                className={`button ${
                                    difficulty === "normal" ? "active" : ""
                                }`}
                                onClick={() =>
                                    setDifficulty(
                                        (difficulty) => (difficulty = "normal")
                                    )
                                }>
                                Normale
                            </div>

                            <div
                                className={`button ${
                                    difficulty === "hard" ? "active" : ""
                                }`}
                                onClick={() =>
                                    setDifficulty(
                                        (difficulty) => (difficulty = "hard")
                                    )
                                }>
                                Difficile
                            </div>
                        </div>

                        <div className="text bomb-number">
                            Bombe: {bombNumber}
                        </div>
                    </div>

                    <div
                        className="button big"
                        onClick={() => {
                            setIsTitleShown(false);
                            setIsGridShown(true);
                        }}>
                        Gioca
                    </div>
                </>
            ) : (
                <>
                    <Grid
                        gridSizeX={gridSizeX}
                        gridSizeY={gridSizeY}
                        difficulty={difficulty}
                        bombNumber={bombNumber}
                        setBombNumber={setBombNumber}
                        setIsGridShown={setIsGridShown}
                        setIsTitleShown={setIsTitleShown}
                    />
                </>
            )}
        </>
    );
}

export default App;
