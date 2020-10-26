import {
  Button, FormControl, InputLabel, MenuItem, Select, TextField,
} from '@material-ui/core';
import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../../../App';
import { Entity, getDocsWithProps } from '../../../../data/Store';
import { ICourse } from '../../../../interfaces/ICourse';
import { ILiveSession } from '../../../../interfaces/ILiveSession';
import classes from './AddLiveSession.module.scss';

export const AddLiveSession = () => {
  const { showSnackbar, email } = useContext(AppContext);

  const [busy, setBusy] = useState<boolean>(false);
  const [session, setSession] = useState<ILiveSession>();
  const [sessions, setSessions] = useState<ILiveSession[]>([]);

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [courseId, setCourseId] = useState<string>('');
  const weekDays = ['SUN', 'MON'];

  const setSessionProps = (obj: any) => {
    setSession((prev) => {
      const newObj = { ...prev, ...obj };
      return newObj;
    });
  };

  const onDateChange = (e: any) => {
    console.log(e.target.value);
  };

  const onSave = () => {

  };

  useEffect(() => {
    getDocsWithProps<ICourse[]>(Entity.COURSES, { ownerEmail: email })
      .then((data) => data && setCourses(data));
    getDocsWithProps<ILiveSession[]>(Entity.LIVE_SESSIONS, { ownerEmail: email })
      .then((data) => data && setSessions(data));
  }, []);

  return (
    <>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
      >

        <TextField
          className={classes.input}
          id="topic"
          label="Topic"
          onChange={(e) => setSessionProps({ topic: e.target.value })}
        />

        <TextField
          className={classes.input}
          id="desc"
          label="Description"
          onChange={(e) => setSessionProps({ description: e.target.value })}
        />

        <TextField
          className={classes.input}
          id="price"
          label="Price"
          type="number"
          onChange={(e) => setSessionProps({ price: e.target.value })}
        />

        <TextField
          className={classes.input}
          id="duration"
          label="Duration"
          onChange={(e) => setSessionProps({ duration: e.target.value })}
        />

        <FormControl className={classes.input}>
          <InputLabel
            id="demo-simple-select-label"
            className="fc1"
          >
            Select Day
          </InputLabel>
          <Select
            className={`${classes.input} fc1`}
            labelId="label1"
            id="id1"
            value={courseId}
            disabled={busy}
            onChange={onDateChange}
          >
            {weekDays.map((day) => (
              <MenuItem
                value={day}
                key={day}
              >
                {`${day}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <form
          className={classes.container}
          noValidate
        >
          <TextField
            id="time"
            label="Alarm clock"
            type="time"
            defaultValue="07:30"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
        </form>

        <Button
          variant="contained"
          onClick={onSave}
          disabled={busy}
        >
          Add Live Session
        </Button>

      </form>
    </>
  );
};
