import { prisma } from "../src/lib/prisma";


async function main() {
  await prisma.cnae.deleteMany();

  // registros de exemplo
  const cnaes = await prisma.cnae.createMany({
    data: [
      {
        cnae_complete: '62.01-5-01',
        cnae_class: '6201-5',
        sector: 'Tecnologia da Informação',
        turnover: 1500000.50,
        risk_range: 'Baixo',
        cnae_score: 85,
      },
      {
        cnae_complete: '64.21-1-00',
        cnae_class: '6421-1',
        sector: 'Serviços Financeiros',
        turnover: 5000000.00,
        risk_range: 'Alto',
        cnae_score: 42,
      },
      {
        cnae_complete: '47.11-3-02',
        cnae_class: '4711-3',
        sector: 'Comércio Varejista',
        turnover: 800000.75,
        risk_range: 'Médio',
        cnae_score: 67,
      },
      {
        cnae_complete: '10.11-2-01',
        cnae_class: '1011-2',
        sector: 'Indústria Alimentícia',
        turnover: 3200000.00,
        risk_range: 'Médio',
        cnae_score: 55,
      },
      {
        cnae_complete: '85.13-9-00',
        cnae_class: '8513-9',
        sector: 'Educação',
        turnover: 950000.25,
        risk_range: 'Baixo',
        cnae_score: 78,
      },
    ],
  });

  console.log(`✓ Seed concluído: ${cnaes.count} registros criados`);
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });