import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import {AdditionalType} from '../../../redux/types'
import { Typography } from '@mui/material';


type CorrelationTableParams = {
    correlation: string,
    methods: AdditionalType[],
    results: number[][]
}

export default function CorrelationTable({correlation, methods, results}: CorrelationTableParams) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="Methods preferences correlation table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant='body1' textAlign='center'>
                CORRELATION TABLE
              </Typography>
              <Typography variant='body2' textAlign='center'>
                {correlation.toUpperCase()}
              </Typography>
            </TableCell>
            {methods.map(method => {
              return (
                <TableCell>
                  <Typography variant='body1' textAlign='center'>
                    {method.method.toUpperCase()}
                  </Typography>
                  <Typography variant='body2' textAlign='center'>
                    {method.weights.toUpperCase()}
                  </Typography>
                </TableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((res, index) => {
            return (
              <TableRow key={index}>
                <TableCell>
                  <Typography variant='body1' textAlign='center'>
                    {methods[index].method.toUpperCase()}
                  </Typography>
                  <Typography variant='body2' textAlign='center'>
                    {methods[index].weights.toUpperCase()}
                  </Typography>
                </TableCell>
                {res.map(r => {
                  return (
                    <TableCell>
                      <Typography variant='body2' textAlign='center'>
                        {r.toFixed(4)}
                      </Typography>
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}