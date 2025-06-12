
import React from 'react';
import PageLayout from '@/components/PageLayout';
import PainelInternamentoTempo from '@/components/internamento/PainelInternamentoTempo';

const PainelInternamento = () => {
  return (
    <PageLayout title="Painel de Internamento">
      <PainelInternamentoTempo />
    </PageLayout>
  );
};

export default PainelInternamento;
