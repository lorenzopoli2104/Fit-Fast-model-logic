import type {
  ScenarioConfig,
  ScenarioId,
  SimulatorInputs,
  SimulatorResults,
  RiskItem,
} from './simulator-types'

// ─── Scenario defaults ─────────────────────────────────────────────────────────
export const SCENARI: ScenarioConfig[] = [
  {
    id: 'completo',
    nome: 'Fit&Fast Completo',
    descrizione: 'Negozio fisico con pasti personalizzati, piatti bilanciati, asporto, consumo in sede e delivery.',
    tag: 'Negozio Fisico',
    isDarkKitchen: false,
    defaults: {
      prezzoLordoCliente: 14.00,
      ivaPercentuale: 10,
      costoIngredienti: 3.80,
      costoImballaggio: 0.50,
      percentualeScarto: 5.5,
      costoLavoro: 7800,
      affittoMensile: 2350,
      altriCostiFissi: 1200,
      pastiGiornalieriMedi: 90,
      giorniOperativiMese: 26,
      mixDeliveryPercentuale: 25,
      commissioneDelivery: 3.25,
      imballaggioDelivery: 0.90,
      mixPiattiPrebilanciatiPerc: 65,
      tempoAssemblaggioCustom: 80,
      surchargeIngredientiPremium: 1.50,
      surchargeProteineExtra: 1.00,
      percentualeOrdiniPremium: 20,
    },
  },
  {
    id: 'solo_personalizzazione',
    nome: 'Solo Personalizzazione',
    descrizione: 'Modello fisico focalizzato su pasti completamente personalizzati. Maggiore complessità, maggiore rischio food cost.',
    tag: 'Negozio Fisico',
    isDarkKitchen: false,
    defaults: {
      prezzoLordoCliente: 14.50,
      ivaPercentuale: 10,
      costoIngredienti: 4.10,
      costoImballaggio: 0.50,
      percentualeScarto: 7,
      costoLavoro: 8500,
      affittoMensile: 2350,
      altriCostiFissi: 1200,
      pastiGiornalieriMedi: 75,
      giorniOperativiMese: 26,
      mixDeliveryPercentuale: 20,
      commissioneDelivery: 3.25,
      imballaggioDelivery: 0.90,
      mixPiattiPrebilanciatiPerc: 15,
      tempoAssemblaggioCustom: 95,
      surchargeIngredientiPremium: 1.50,
      surchargeProteineExtra: 1.00,
      percentualeOrdiniPremium: 25,
    },
  },
  {
    id: 'solo_bilanciati',
    nome: 'Solo Piatti Bilanciati',
    descrizione: 'Modello fisico con solo piatti pre-bilanciati per massa, mantenimento e dimagrimento. Alta efficienza operativa.',
    tag: 'Negozio Fisico',
    isDarkKitchen: false,
    defaults: {
      prezzoLordoCliente: 13.50,
      ivaPercentuale: 10,
      costoIngredienti: 3.50,
      costoImballaggio: 0.45,
      percentualeScarto: 4,
      costoLavoro: 6800,
      affittoMensile: 2350,
      altriCostiFissi: 1100,
      pastiGiornalieriMedi: 100,
      giorniOperativiMese: 26,
      mixDeliveryPercentuale: 20,
      commissioneDelivery: 3.00,
      imballaggioDelivery: 0.85,
      mixPiattiPrebilanciatiPerc: 95,
      tempoAssemblaggioCustom: 50,
      surchargeIngredientiPremium: 1.00,
      surchargeProteineExtra: 0.80,
      percentualeOrdiniPremium: 10,
    },
  },
  {
    id: 'dark_completa',
    nome: 'Dark Kitchen Completa',
    descrizione: 'Solo delivery con pasti custom e prebilanciati. Nessun punto vendita fisico. Ticket più alto per compensare i costi delivery.',
    tag: 'Dark Kitchen',
    isDarkKitchen: true,
    defaults: {
      prezzoLordoCliente: 16.00,
      ivaPercentuale: 10,
      costoIngredienti: 4.00,
      costoImballaggio: 0.65,
      percentualeScarto: 5.5,
      costoLavoro: 5500,
      affittoMensile: 800,
      altriCostiFissi: 900,
      pastiGiornalieriMedi: 80,
      giorniOperativiMese: 26,
      mixDeliveryPercentuale: 100,
      commissioneDelivery: 3.50,
      imballaggioDelivery: 1.00,
      mixPiattiPrebilanciatiPerc: 55,
      tempoAssemblaggioCustom: 85,
      surchargeIngredientiPremium: 1.50,
      surchargeProteineExtra: 1.00,
      percentualeOrdiniPremium: 20,
    },
  },
  {
    id: 'dark_personalizzata',
    nome: 'Dark Kitchen Personalizzata',
    descrizione: 'Solo delivery con pasti completamente personalizzati. La complessità più alta tra i modelli dark kitchen.',
    tag: 'Dark Kitchen',
    isDarkKitchen: true,
    defaults: {
      prezzoLordoCliente: 17.00,
      ivaPercentuale: 10,
      costoIngredienti: 4.30,
      costoImballaggio: 0.65,
      percentualeScarto: 7,
      costoLavoro: 5800,
      affittoMensile: 800,
      altriCostiFissi: 900,
      pastiGiornalieriMedi: 65,
      giorniOperativiMese: 26,
      mixDeliveryPercentuale: 100,
      commissioneDelivery: 3.50,
      imballaggioDelivery: 1.05,
      mixPiattiPrebilanciatiPerc: 10,
      tempoAssemblaggioCustom: 100,
      surchargeIngredientiPremium: 1.80,
      surchargeProteineExtra: 1.20,
      percentualeOrdiniPremium: 30,
    },
  },
  {
    id: 'dark_bilanciati',
    nome: 'Dark Kitchen Solo Piatti Bilanciati',
    descrizione: 'Solo delivery con piatti pre-bilanciati. Maggiore standardizzazione, logica batch, costo lavoro inferiore.',
    tag: 'Dark Kitchen',
    isDarkKitchen: true,
    defaults: {
      prezzoLordoCliente: 15.50,
      ivaPercentuale: 10,
      costoIngredienti: 3.70,
      costoImballaggio: 0.60,
      percentualeScarto: 4,
      costoLavoro: 4800,
      affittoMensile: 800,
      altriCostiFissi: 800,
      pastiGiornalieriMedi: 90,
      giorniOperativiMese: 26,
      mixDeliveryPercentuale: 100,
      commissioneDelivery: 3.25,
      imballaggioDelivery: 0.95,
      mixPiattiPrebilanciatiPerc: 97,
      tempoAssemblaggioCustom: 50,
      surchargeIngredientiPremium: 1.00,
      surchargeProteineExtra: 0.80,
      percentualeOrdiniPremium: 10,
    },
  },
]

export function getScenario(id: ScenarioId): ScenarioConfig {
  return SCENARI.find((s) => s.id === id) ?? SCENARI[0]
}

// ─── Core calculation engine ───────────────────────────────────────────────────
export function calcolaSimulazione(inp: SimulatorInputs): SimulatorResults {
  // 1. Revenue per meal
  const ricavoNettoPerPasto = inp.prezzoLordoCliente / (1 + inp.ivaPercentuale / 100)

  // 2. Volume
  const pastiMensili = inp.pastiGiornalieriMedi * inp.giorniOperativiMese
  const ordiniDeliveryMensili = pastiMensili * (inp.mixDeliveryPercentuale / 100)

  // 3. Premium surcharge revenue
  const ricavoExtraPremiumPerPasto =
    (inp.percentualeOrdiniPremium / 100) *
    (inp.surchargeIngredientiPremium + inp.surchargeProteineExtra)
  const ricavoNettoAdjPerPasto = ricavoNettoPerPasto + ricavoExtraPremiumPerPasto

  // 4. Monthly gross & net revenue
  const ricavoLordoMensile = inp.prezzoLordoCliente * pastiMensili
  const ricavoNettoPremiumAdjusted = ricavoNettoAdjPerPasto * pastiMensili

  // 5. COGS per meal
  const costoScartoEffettivo = inp.costoIngredienti * (inp.percentualeScarto / 100)
  const imballaggioBasePerPasto = inp.costoImballaggio

  // Delivery packaging is applied only on delivery share
  const imballaggioMedioPerPasto =
    imballaggioBasePerPasto +
    (inp.mixDeliveryPercentuale / 100) * inp.imballaggioDelivery

  const cogsEffettivoPerPasto =
    inp.costoIngredienti + costoScartoEffettivo + imballaggioMedioPerPasto

  const cogsPercentuale = (cogsEffettivoPerPasto / ricavoNettoPerPasto) * 100

  // 6. Delivery costs monthly
  const costoDeliveryTotalePerOrdine = inp.commissioneDelivery
  const impactoDeliveryMensile = costoDeliveryTotalePerOrdine * ordiniDeliveryMensili

  // 7. Prime cost per meal
  const costoLavoroPerPasto = inp.costoLavoro / pastiMensili
  const primeCostPerPasto =
    inp.costoIngredienti + costoScartoEffettivo + costoLavoroPerPasto
  const primeCostPercentuale = (primeCostPerPasto / ricavoNettoPerPasto) * 100

  // 8. Monthly P&L
  const ricavoNettoMensile = ricavoNettoPerPasto * pastiMensili
  const cogsMensile = cogsEffettivoPerPasto * pastiMensili
  const margineContributivo = ricavoNettoPremiumAdjusted - cogsMensile - impactoDeliveryMensile
  const margineContributivoPerc = (margineContributivo / ricavoNettoPremiumAdjusted) * 100

  const costiFissiTotali = inp.costoLavoro + inp.affittoMensile + inp.altriCostiFissi
  const ebitdaMensile = margineContributivo - costiFissiTotali
  const ebitdaMarginPerc = (ebitdaMensile / ricavoNettoPremiumAdjusted) * 100

  // 9. Break-even (pasti/giorno)
  const contribuzioneNettaPerPasto =
    ricavoNettoAdjPerPasto - cogsEffettivoPerPasto - costoDeliveryTotalePerOrdine * (inp.mixDeliveryPercentuale / 100)
  const breakEvenPastiMese =
    contribuzioneNettaPerPasto > 0
      ? costiFissiTotali / contribuzioneNettaPerPasto
      : Infinity
  const breakEvenPastiGiorno = breakEvenPastiMese / inp.giorniOperativiMese

  // 10. Risk scoring
  const risks: RiskItem[] = []

  if (cogsPercentuale > 40) {
    risks.push({ livello: 'critico', messaggio: `COGS effettivo ${cogsPercentuale.toFixed(1)}% — strutturalmente insostenibile a questo prezzo. Rivedere menu, prezzi o operazioni.` })
  } else if (cogsPercentuale > 38) {
    risks.push({ livello: 'critico', messaggio: `COGS effettivo ${cogsPercentuale.toFixed(1)}% — soglia critica superata. Intervento immediato necessario.` })
  } else if (cogsPercentuale > 35) {
    risks.push({ livello: 'attenzione', messaggio: `COGS effettivo ${cogsPercentuale.toFixed(1)}% — sopra la soglia di attenzione (35%). Monitorare attentamente.` })
  }

  if (primeCostPercentuale > 65) {
    risks.push({ livello: 'critico', messaggio: `Prime cost ${primeCostPercentuale.toFixed(1)}% — soglia critica superata (limite: 65%). Ridurre food cost o lavoro.` })
  }

  if (ebitdaMarginPerc < 0) {
    risks.push({ livello: 'critico', messaggio: `EBITDA negativo (${ebitdaMarginPerc.toFixed(1)}%) — il modello non è sostenibile con questi parametri.` })
  } else if (ebitdaMarginPerc < 10) {
    risks.push({ livello: 'attenzione', messaggio: `Margine EBITDA ${ebitdaMarginPerc.toFixed(1)}% — alto rischio. Target minimo: 10%.` })
  }

  if (breakEvenPastiGiorno > 130) {
    risks.push({ livello: 'critico', messaggio: `Break-even a ${breakEvenPastiGiorno.toFixed(0)} pasti/giorno — troppo alto per il primo punto vendita.` })
  } else if (breakEvenPastiGiorno > 100) {
    risks.push({ livello: 'attenzione', messaggio: `Break-even a ${breakEvenPastiGiorno.toFixed(0)} pasti/giorno — difficile da raggiungere in avvio.` })
  }

  if (inp.mixDeliveryPercentuale <= 70 && inp.mixDeliveryPercentuale > 40) {
    risks.push({ livello: 'attenzione', messaggio: `Mix delivery ${inp.mixDeliveryPercentuale}% — alto per un modello fisico. Valutare aumento del ticket delivery.` })
  }

  if (inp.mixDeliveryPercentuale === 100 && inp.prezzoLordoCliente < 15.50) {
    risks.push({ livello: 'attenzione', messaggio: `Ticket medio €${inp.prezzoLordoCliente.toFixed(2)} troppo basso per un modello 100% delivery. Target: almeno €15.50.` })
  }

  const mixCustomPerc = 100 - inp.mixPiattiPrebilanciatiPerc
  if (mixCustomPerc > 80) {
    risks.push({ livello: 'critico', messaggio: `Mix personalizzazione ${mixCustomPerc}% — complessità operativa critica. Target: max 70–80%.` })
  } else if (mixCustomPerc > 70) {
    risks.push({ livello: 'attenzione', messaggio: `Mix personalizzazione ${mixCustomPerc}% — rischio complessità operativa. Valutare più piatti prebilanciati.` })
  }

  if (inp.tempoAssemblaggioCustom > 120) {
    risks.push({ livello: 'critico', messaggio: `Tempo assemblaggio custom ${inp.tempoAssemblaggioCustom}s — soglia critica superata (120s). Throughput insufficiente.` })
  } else if (inp.tempoAssemblaggioCustom > 90) {
    risks.push({ livello: 'attenzione', messaggio: `Tempo assemblaggio custom ${inp.tempoAssemblaggioCustom}s — vicino alla soglia critica. Target: 60–90s.` })
  }

  if (imballaggioBasePerPasto > 0.80 && inp.mixDeliveryPercentuale < 100) {
    risks.push({ livello: 'attenzione', messaggio: `Imballaggio in-store €${imballaggioBasePerPasto.toFixed(2)} — sopra la soglia di attenzione (€0.80).` })
  }

  if (imballaggioMedioPerPasto - imballaggioBasePerPasto > 1.10 && inp.mixDeliveryPercentuale > 0) {
    risks.push({ livello: 'attenzione', messaggio: `Imballaggio delivery €${inp.imballaggioDelivery.toFixed(2)} extra — sopra la soglia di attenzione (€1.10).` })
  }

  return {
    ricavoNettoPerPasto,
    ricavoNettoMensile,
    ricavoLordoMensile,
    costoScartoEffettivo,
    cogsEffettivoPerPasto,
    cogsPercentuale,
    costoDeliveryTotalePerOrdine,
    impactoDeliveryMensile,
    costoLavoroPerPasto,
    primeCostPerPasto,
    primeCostPercentuale,
    ricavoNettoPremiumAdjusted,
    margineContributivo,
    margineContributivoPerc,
    ebitdaMensile,
    ebitdaMarginPerc,
    breakEvenPastiGiorno,
    risks,
  }
}
