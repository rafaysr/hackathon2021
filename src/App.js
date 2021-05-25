import logo from './logo.svg';
import './App.css';
import { Button, Popover, Menu, MenuItem, Checkbox } from '@blueprintjs/core/';
import { useState } from 'react';
import { filter, uniq } from 'lodash';

import { newJson, bluepattern } from "./mockData";
const parsedJson = JSON.parse(newJson);
const parsedBluePattern = JSON.parse(bluepattern);

let totalChecked = 0;
let inputSelections = [];

const App = () => {
    const [isLoading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [results, setResults] = useState([]);
    const [mergedResult, setMergedResult] = useState('')
    const [lengthFilter, setLengthFilter] = useState('long');
    const [sleeveFilter, setSleeveFilter] = useState('half');
    const [newUpdates, setNewUpdates] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [dataSet, setDataSet] = useState(parsedJson);

    // const [totalChecked, setTotalChecked] = useState(0);
    const handleClickSearch = () => {
        if (hasGenerated) {
            const randInt = Math.random()*4000+1000;
            setLoading(true);
            setTimeout(()=>{
                setLoading(false);
                loadResults();
            }, randInt);
        } else {
            alert('Curse your sudden but inevitable betrayal! You have updated your parameters, please generate image before searching.');
        }

    }

    const handleClickGenerate = () => {
        console.log('*'.repeat(100));
        console.log(inputSelections);
        console.log('*'.repeat(100));
        if (totalChecked < 2) {
            alert('Curse your sudden but inevitable betrayal! Please select at least 2 images.');
        } else if (newUpdates) {
            const randInt = Math.random()*3000+500;
            setGenerating(true);
            setTimeout(()=>{
                setGenerating(false);
                loadMergedResult();
                setNewUpdates(false);
                setHasGenerated(true);
            }, randInt);
        } else {
            alert('Curse your sudden but inevitable betrayal! Generated Images is already updated.');
        }
    }


    const shuffle = (array) => {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    const handleOnSelectLength = (ev) => {
        setNewUpdates(true);
        setLengthFilter(ev.target.textContent);
        setResults();
        setHasGenerated(false);
        // loadMergedResult();
    }

    const handleOnSelectSleeves = (ev) => {
        setNewUpdates(true);
        setSleeveFilter(ev.target.textContent);
        setResults();
        setHasGenerated(false);
        // loadMergedResult();
    }

    const handleInputSelection = (ev) => {
        if (ev.target.checked) {
            totalChecked++;
            inputSelections = (uniq([...inputSelections, ev.target.id]));
        } else {
            totalChecked--;
            inputSelections.splice(inputSelections.indexOf(ev.target.id), 1);
        }

        if (totalChecked <= 2) {
            setNewUpdates(true);
            setMergedResult();
            setResults();
        } else {
            ev.target.checked = false;
            totalChecked--;
            alert('Curse your sudden but inevitable betrayal! You may only select a max of 2');
        }

        console.log(inputSelections);
        if (uniq(inputSelections).sort().toString() === ['patterned', 'blue'].sort().toString()) {
            setDataSet(parsedBluePattern);
            setLengthFilter('short');
            setSleeveFilter('sleeveless');
        } else {
            setDataSet(parsedJson);
            setLengthFilter('short');
            setSleeveFilter('full');
        }
    }

    const loadMergedResult = () => {
        const filteredMergedResult = filter(dataSet.merged, {'length': lengthFilter, 'sleeve_length': sleeveFilter});
        setMergedResult(filteredMergedResult[0].url);
    }

    const loadResults = () => {
        const filteredResults = filter(dataSet.result, {'length': lengthFilter, 'sleeve_length': sleeveFilter});
        console.log('*'.repeat(100));
        console.log(filteredResults);
        console.log('*'.repeat(100));
        setResults(shuffle(filteredResults));
    }



    const renderCards = () => {
        let cards = [];

        for (let i in results) {
            cards.push(<div className={"image_card"}>
                <img src={results[i].url}/>
            </div>);
        }


        return cards;
    }

    const getFilters = () => {
        const filters = [
                {
                    title: "Dress Length",
                    options: ['short', 'long'],
                    disabled: false,
                    active: false,
                    action: handleOnSelectLength
                },
                {
                    title: "Color",
                    options: ['blue', 'black', 'red'],
                    disabled: true,
                    active: false
                },
                {
                    title: "Sleeve Length",
                    options: ['sleeveless', 'half', 'full'],
                    disabled: false,
                    active: false,
                    action: handleOnSelectSleeves
                }
            ];

        let filterBar = [];

        const composeOptions = (options, action) => {
            let result = [];

            for (let i in options) {
                result.push(<MenuItem
                    id={options[i]}
                    text={options[i]}
                    onClick={action}
                />);
            }

            return result;
        }

        for (let i in filters) {
            filterBar.push( <Popover content={<Menu>{composeOptions(filters[i].options, filters[i].action)}</Menu>}>
                    <Button
                        id={filters[i].title}
                        className={"filter_bar__title"}
                        text={filters[i].title}
                        disabled={filters[i].disabled}
                        active={filters[i].active}
                    />
                </Popover>
            )
        }


        return filterBar;
    }

    const loadInputImages = () => {
        let cards = [];

        for (let i in parsedJson.input) {
            cards.push(<Checkbox id={parsedJson.input[i].index} className={`image_card`} onClick={handleInputSelection} >
                <img src={parsedJson.input[i].url}/>
            </Checkbox>);
        }

        return cards;
    }

    const loadingGif = 'https://emoji.slack-edge.com/T19855G21/catjam/6048538756503f07.gif';

  return (
    <div className="App">
        <div className={"title"} />
        <div className={'image_selector'}>
            <h2 className={"image_selector__headline"}>Please select up to 2 images to find results</h2>
            <div className={"image_selector__selections image_card_wrapper"}>
                {loadInputImages()}
            </div>
        </div>
        <div className={"filter_bar"}>
            {getFilters()}
            <div className="blurb"> Modify generated results so it is <strong>{lengthFilter}er</strong> in length with <strong>{sleeveFilter}</strong> sleeves.</div>
            <div className={"button_wrapper"}>
                <Button className={!newUpdates ? 'hidden' : '' } text={'Generate from selections'} loading={generating} large={true} onClick={handleClickGenerate} disabled={!newUpdates}/>
                <Button className={!hasGenerated || newUpdates ? 'hidden' : '' } text={'Find similar results'} loading={isLoading} large={true} onClick={handleClickSearch} disabled={!hasGenerated}/>
            </div>
        </div>
        <div className={'merged_result'}>
            <h3>Generated Result:</h3>
            <img src={generating ? loadingGif : mergedResult}/>
        </div>
        <h2>Visually similar results:</h2>
        <div className={`image_card_wrapper image_card_wrapper__results`}>
            {isLoading ? <img src={loadingGif} /> : renderCards(results)}
        </div>
    </div>
  );
}

export default App;
