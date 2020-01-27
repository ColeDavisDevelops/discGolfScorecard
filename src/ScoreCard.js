import React, { useEffect, useState } from 'react';
// FIREBASE
import * as firebase from 'firebase';
// MATERIAL-UI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import NativeSelect from '@material-ui/core/NativeSelect';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({

}))

const initHoleData = {
  ['hole 1']: 3,
  ['hole 2']: 3,
  ['hole 3']: 3,
  ['hole 4']: 3,
  ['hole 5']: 3,
  ['hole 6']: 3,
  ['hole 7']: 3,
  ['hole 8']: 3,
  ['hole 9']: 3,
  ['hole 10']: 3,
  ['hole 11']: 3,
  ['hole 12']: 3,
  ['hole 13']: 3,
  ['hole 14']: 3,
  ['hole 15']: 3,
  ['hole 16']: 3,
  ['hole 17']: 3,
  ['hole 18']: 3,
  ['hole 19']: 3,
  ['hole 20']: 3,
  ['hole 21']: 3,
  ['hole 22']: 3,  
}

const ScoreCard = () => {
  const [state, setState] = useState({
    isLoading: true,
    players: 1,
    holes: 9,
    playerNames: {
      ["player 1"]: "",
      ["player 2"]: "",
      ["player 3"]: "",
      ["player 4"]: "",
      ["player 5"]: "",
      ["player 6"]: "",
    }
  });

  useEffect(() => {
    const getData = async() => {
      firebase.firestore().collection('scoreCard').doc('state')
        .onSnapshot((doc) => {
          let data = doc.data()         
          setState(state => ({
            ...state,
            players: data.players,
            holes: data.holes,
          }))                                
        })
      firebase.firestore().collection('scoreCard').doc('par')
        .onSnapshot((doc) => {
          setState(state => ({
            ...state,
            ['par']: doc.data()
          }))
        }) 

      firebase.firestore().collection('scoreCard').doc('playerNames')
        .onSnapshot((doc) => {
          setState(state => ({
            ...state,
            playerNames: doc.data()
          }))
        })
    }
    getData()
      .then(() => {
        setState(state => ({
          ...state,
          isLoading: false
        }))          
      })
  }, [])

  useEffect(() => {
    // for each player get their data
    for (let i=0; i<state.players; i++) {
      firebase.firestore().collection('scoreCard').doc(`player ${i+1}`)
        .onSnapshot((doc) => {
          setState(state => ({
            ...state,
            [`player ${i+1}`]: doc.data()
          }))
        }) 
    }   
  }, [state.players])

  const handleChange = (name) => event => {
    firebase.firestore().collection('scoreCard').doc('state')
      .update({
        [name]: event.target.value
      })
      .then(() => {
        clearRowValues();
      })
      .catch((err) => {
        console.log(err)
      })
    console.log(state)
  }

  const handleChangeValue = (name, counter) => (event) => {
    console.log(name)
    let value = parseInt(event.target.value)
    firebase.firestore().collection('scoreCard').doc(name)
      .update({
        [`hole ${counter}`]: value
      })
      .then(() => {
        console.log('success')
        setState(state => ({
          ...state,
          [name]: {
            ...state[name],
            [`hole ${counter}`]: value
          }
        }))
      })
      .catch((err) => {
        console.log(err)
      })                              
  }

  const calculateTotals = (obj) => {
    let colValues = [];
    let total = 0;
    if (state[obj] !== undefined) {
      // change for set values
      for (let [key, value] of Object.entries(state[obj])) {
        colValues.push(value)
      }       
      total = colValues.reduce((tot, num) => {
        return (tot + num)
      })
      console.log(total)
    } else {
      total = state.holes
    }
    if (obj === 'par') {
      total = total - ((22 - state.holes) * 3)
    }
    return total
  }

  const handleChangeName = (event, playerNum) => {
    console.log(playerNum)
    firebase.firestore().collection('scoreCard').doc('playerNames')
      .update({
        [`player ${playerNum}`]: event.target.value
      })
  } 
  
  const displayPlayer = () => {
    let players = [];
    let counter = 1;

    for (let i=0; i<state.players; i++) {  
      players.push(
        <Grid item direction='column' style={{width: 80}}>
          <TextField id="standard-basic" label={`player ${counter}`} style={{padding: 5}} value={state.playerNames[`player ${counter}`]} onChange={(e) => handleChangeName(e, i+1)}/>
          {generateSelects(`player ${counter}`)}
        </Grid>
      )
      counter++
    }
    return players
  }

  const generateSelects = (name) => {
    let selects = [];
    let counter = 1;
    let value = ''
    for (let i=0; i<state.holes; i++) {
      if (state[name] !== undefined) {
        value = state[name][`hole ${counter}`]
      }      
      selects.push(
        <Grid item xs={12} style={{border: 'solid 1px', height: 34}}> 
          <NativeSelect
            style={{width: '100%'}}
            onChange={handleChangeValue(name, counter)}
            value={value}
          >
            <option value={0}>
              0 
            </option>               
            <option value={1}>
              1 
            </option>   
            <option value={2}>
              2 
            </option>   
            <option value={3}>
              3
            </option>
            <option value={4}>
              4
            </option>     
            <option value={5}>
              5
            </option> 
            <option value={6}>
              TRA!
            </option>                                        
          </NativeSelect>    
        </Grid>
      )
      counter++
    }
    if (name === 'par') {
      selects.push(
        <Grid item xs={12} style={{border: 'solid 1px', height: 34}}>
          <Typography>
            {calculateTotals('par')}
          </Typography>
        </Grid>
      )
    } else {
      selects.push(
        <Grid item xs={12} style={{border: 'solid 1px', height: 34}}>
          <Typography>
            {calculateTotals(name)} / {calculateTotals(name) - calculateTotals('par')}
          </Typography>
        </Grid>
      )
    }
    return selects;
  }

  const displayHoles = () => {
    let holes = [];
    let counter = 1;
    for (let i=0; i<state.holes; i++) {
      holes.push(
        <Grid item xs={12} style={{border: 'solid 1px', height: 34}}>
          <Typography style={{width: '100%'}}>
            {counter}
          </Typography>
        </Grid>
      )
      counter++
    }
    holes.push(
      <Grid item xs={12} style={{border: 'solid 1px', height: 34}}>
        <Typography>
          total:
        </Typography>
      </Grid>

    )
    return holes
  }

  const clearRowValues = () => {
    firebase.firestore().collection('scoreCard').doc('par')
      .set({
        ['hole 1']: 3,
        ['hole 2']: 3,
        ['hole 3']: 3,
        ['hole 4']: 3,
        ['hole 5']: 3,
        ['hole 6']: 3,
        ['hole 7']: 3,
        ['hole 8']: 3,
        ['hole 9']: 3,
        ['hole 10']: 3,
        ['hole 11']: 3,
        ['hole 12']: 3,
        ['hole 13']: 3,
        ['hole 14']: 3,
        ['hole 15']: 3,
        ['hole 16']: 3,
        ['hole 17']: 3,
        ['hole 18']: 3,
        ['hole 19']: 3,
        ['hole 20']: 3,
        ['hole 21']: 3,
        ['hole 22']: 3,
      })
      .then(() => {
        console.log('reset!')
        setState(state => ({
          ...state,
          ['par']: {
            ['hole 1']: 3,
            ['hole 2']: 3,
            ['hole 3']: 3,
            ['hole 4']: 3,
            ['hole 5']: 3,
            ['hole 6']: 3,
            ['hole 7']: 3,
            ['hole 8']: 3,
            ['hole 9']: 3,
            ['hole 10']: 3,
            ['hole 11']: 3,
            ['hole 12']: 3,
            ['hole 13']: 3,
            ['hole 14']: 3,
            ['hole 15']: 3,
            ['hole 16']: 3,
            ['hole 17']: 3,
            ['hole 18']: 3,
            ['hole 19']: 3,
            ['hole 20']: 3,
            ['hole 21']: 3,
            ['hole 22']: 3,  
          }      
        }))
      })
      .catch((err) => {
        console.log(err)
      })    
    
    
    for (let i=0; i<state.players; i++) {
      firebase.firestore().collection('scoreCard').doc(`player ${i+1}`)
        .set({
          ['hole 1']: 0,
          ['hole 2']: 0,
          ['hole 3']: 0,
          ['hole 4']: 0,
          ['hole 5']: 0,
          ['hole 6']: 0,
          ['hole 7']: 0,
          ['hole 8']: 0,
          ['hole 9']: 0,
          ['hole 10']: 0,
          ['hole 11']: 0,
          ['hole 12']: 0,
          ['hole 13']: 0,
          ['hole 14']: 0,
          ['hole 15']: 0,
          ['hole 16']: 0,
          ['hole 17']: 0,
          ['hole 18']: 0,
          ['hole 19']: 0,
          ['hole 20']: 0,
          ['hole 21']: 0,
          ['hole 22']: 0,
        })
        .then(() => {
          console.log('reset!')
          setState(state => ({
            ...state,
            [`player ${i+1}`]: {
              ['hole 1']: 0,
              ['hole 2']: 0,
              ['hole 3']: 0,
              ['hole 4']: 0,
              ['hole 5']: 0,
              ['hole 6']: 0,
              ['hole 7']: 0,
              ['hole 8']: 0,
              ['hole 9']: 0,
              ['hole 10']: 0,
              ['hole 11']: 0,
              ['hole 12']: 0,
              ['hole 13']: 0,
              ['hole 14']: 0,
              ['hole 15']: 0,
              ['hole 16']: 0,
              ['hole 17']: 0,
              ['hole 18']: 0,
              ['hole 19']: 0,
              ['hole 20']: 0,
              ['hole 21']: 0,
              ['hole 22']: 0,    
            }      
          }))
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  return ( 
    <Grid container >
      <Typography align='center' variant='h6' style={{fontWeight: 'bolder', width: '100%'}}>
        Disc Golf Hub
      </Typography>
      <Grid item xs={12} >
        <Options handleChange={handleChange} holeValue={state.holes} playerValue={state.players} clearRowValues={clearRowValues}/>
      </Grid>
      <Grid container item style={{overflowX: 'hidden', display: 'flex', flexWrap: 'wrap', minWidth: 1000}}>
        <Grid item container column align="direction" style={{width: 80}}>
          <Typography style={{width: '100%', marginBottom: 11, marginTop: 15}} variant="h6">
            Hole   
          </Typography>
          {displayHoles()}
        </Grid>
        <Grid item container column align="direction" style={{width: 80}}>
          <Typography style={{width: '100%', marginBottom: 11, marginTop: 15}} variant="h6">
            Par  
          </Typography>   
          {generateSelects('par')}
        </Grid>
        {displayPlayer()}
      </Grid>
    </Grid>
  )
}

const Options = (props) => {
  return (
    <React.Fragment>
      <FormControl style={{display: 'block'}}>
        <InputLabel>
          Holes
        </InputLabel>
        <NativeSelect style={{width: '100%'}}
          onChange={props.handleChange('holes')}
          value={props.holeValue}
        >
          <option value={9}>
            9
          </option>        
          <option value={18}>
            18
          </option>
          <option value={21}>
            21
          </option>
        </NativeSelect>
      </FormControl>
      <FormControl style={{display: 'block'}}>
        <InputLabel>
          Players
        </InputLabel>
        <NativeSelect style={{width: '100%'}}
          onChange={props.handleChange('players')}
          value={props.playerValue}
        >
          <option value={1}>
            1 
          </option>        
          <option value={2}>
            2
          </option>
          <option value={3}>
            3
          </option>
          <option value={4}>
            4
          </option>
          <option value={5}>
            5
          </option>
          <option value={6}>
            6
          </option>
          <option value={7}>
            7
          </option>                                        
        </NativeSelect>
      </FormControl>    
      <Button onClick={props.clearRowValues} variant='outlined' style={{margin: 10, width: '95%'}}>clear!</Button>
    </React.Fragment>
  )
}

export default ScoreCard;