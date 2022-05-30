import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Box, Button, Grid } from '@mui/material';
import { TableChart as TableChartIcon, AddOutlined as AddOutlinedIcon } from '@mui/icons-material';
import BoardsListItem from './BoardsListItem';
import Spinner from '$components/Spinner';
import { IBoard, TSimpleFunction } from '$types/common';
import css from './BoardsList.module.scss';

interface IBoardsListProps {
  boards: Array<IBoard>;
  addCardHandler: TSimpleFunction;
  showSearchResults: boolean;
  showSpinnerEnd?: boolean;
}

const BoardsList: FC<IBoardsListProps> = ({
  boards,
  addCardHandler,
  showSearchResults,
  showSpinnerEnd = false,
}) => {
  const { t } = useTranslation();

  return (
    <Grid container component="ul" className={css.boardsList}>
      {boards.map((boardItem: IBoard) => (
        <BoardsListItem key={boardItem.id} {...boardItem} />
      ))}

      <>
        {showSpinnerEnd && (
          <Grid
            item
            component="li"
            className={classNames(css.boardsList__item, css.spinner__item)}
            mb={5}
          >
            <Spinner size={40} />
          </Grid>
        )}
      </>

      {!showSearchResults && (
        <Grid item component="li" className={css.boardsList__item} mb={5}>
          <Button
            className={classNames(css.boardsList__item_addButton, {
              [css.disabled]: showSpinnerEnd,
            })}
            onClick={addCardHandler}
            disabled={showSpinnerEnd}
          >
            <Box className={css.boardsList__item_addButtonText} component="span">
              {t('Boards.addNewBoardButtonText')}
            </Box>
            <Box className={css.boardsList__item_buttonIconWrapper} component="span">
              <TableChartIcon color="inherit" />
              <AddOutlinedIcon color="inherit" />
            </Box>
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default BoardsList;
