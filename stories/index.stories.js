import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import TimeSeries from '../src/charts/time-series'
import CampaignStats from '../src/mock-data/campaign-stats'

const data = CampaignStats.filter(
  (point) => point.hour === -1
).map((point) => {
  const copy = { ...point }
  copy.date = moment.utc(point.date)
  delete copy.hour
  return copy
})
