
import React from 'react';
import PageLayout from '@/components/PageLayout';
import AgendaDragDrop from '@/components/agenda/AgendaDragDrop';

const AgendaDragDropPage = () => {
  return (
    <PageLayout title="Agenda Interativa">
      <AgendaDragDrop />
    </PageLayout>
  );
};

export default AgendaDragDropPage;
