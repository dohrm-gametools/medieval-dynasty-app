import * as React from 'react';
import { styled } from '@mui/material';


const StyledGameIcon = styled('img')(({}) => ({}));

export const GameIcon: React.ComponentType<{ path: string }> = ({ path }) => <StyledGameIcon src={ `/public/images/${ path }` } width={ 32 } height={ 32 }/>
