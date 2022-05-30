import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon, TableChart as TableChartIcon } from '@mui/icons-material';
import { Grid, InputBase } from '@mui/material';
import { TChangeElHandler } from '$types/common';
import { TChangeBoardsShow } from './Boards';
import css from './Boards.module.scss';

interface IBoardsHeadProps {
  searchCB: TChangeBoardsShow;
}

const BoardsHead: FC<IBoardsHeadProps> = ({ searchCB }) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState<string>('');

  const inputSearchHandler: TChangeElHandler<HTMLInputElement> = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    searchCB(searchValue);
  }, [searchCB, searchValue]);

  return (
    <Grid container className={css.boards__head} direction="row" alignItems="flex-start" mb={5}>
      <Grid item className={css.boards__head_name} component="h2">
        {t('Boards.pageTitle')}
        <TableChartIcon />
      </Grid>

      <Grid item className={css.boards__head_form} component="form" autoComplete="off" noValidate>
        <InputBase
          name="searchValue"
          autoFocus={true}
          className={css.boards__head_search}
          type="search"
          placeholder={t('Boards.inputSearchText')}
          inputProps={{
            'aria-label': t('Boards.inputSearchTextLabel'),
          }}
          value={searchValue}
          onChange={inputSearchHandler}
          endAdornment={!searchValue && <SearchIcon />}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default BoardsHead;
