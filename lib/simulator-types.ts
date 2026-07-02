// ─── Scenario IDs ──────────────────────────────────────────────────────────────
export type ScenarioId =
  | 'completo'
  | 'solo_personalizzazione'
  | 'solo_bilanciati'
  | 'dark_completa'
  | 'dark_personalizzata'
  | 'dark_bilanciati'

// ─── Input parameters (what the user edits) ────────────────────────────────────
export interface SimulatorInputs {
  // Pricing
  prezzoLordoCliente: number         // Prezzo lordo cliente (IVA inclusa)
  ivaPercentuale: number             // IVA %
  // Food cost
  costoIngredienti: number           // Costo ingredienti (€)
  costoImballaggio: number           // Costo imballaggio per pasto (€)
  percentualeScarto: number          // % scarto su costo ingredienti
  // Labor
  costoLavoro: number                // Costo lavoro mensile (€)
  // Rent / fixed
  affittoMensile: number             // Affitto mensile (€)
  altriCostiFissi: number            // Altri costi fissi mensili (€)
  // Volume
  pastiGiornalieriMedi: number       // Pasti/giorno medi
  giorniOperativiMese: number        // Giorni operativi/mese
  // Delivery
  mixDeliveryPercentuale: number     // % ordini delivery
  commissioneDelivery: number        // Commissione delivery (€ per ordine)
  imballaggioDelivery: number        // Imballaggio delivery extra (€ per ordine)
  // Menu mix
  mixPiattiPrebilanciatiPerc: number // % piatti prebilanciati
  // Assembly time
  tempoAssemblaggioCustom: number    // Secondi assemblaggio piatto custom
  // Premium ingredients
  surchargeIngredientiPremium: number // Extra prezzo ingredienti premium (€)
  surchargeProteineExtra: number      // Extra prezzo proteine extra (€)
  percentualeOrdiniPremium: number    // % ordini con ingredienti premium
}

// ─── Computed KPIs ─────────────────────────────────────────────────────────────
export interface SimulatorResults {
  // Revenue
  ricavoNettoPerPasto: number         // Ricavo netto IVA esclusa per pasto
  ricavoNettoMensile: number          // Ricavo netto mensile
  ricavoLordoMensile: number          // Ricavo lordo mensile
  // COGS
  costoScartoEffettivo: number        // Costo scarto effettivo (€/pasto)
  cogsEffettivoPerPasto: number       // COGS totale per pasto (ingredienti + imballaggio + scarto)
  cogsPercentuale: number             // COGS % su ricavo netto
  // Delivery economics
  commissioneDeliveryPerOrdine: number // Commissione piattaforma per ordine (l'imballaggio delivery è già incluso nel COGS)
  impactoDeliveryMensile: number       // Impatto costi delivery mensile
  // Labor & prime cost
  costoLavoroPerPasto: number
  primeCostPerPasto: number            // Ingredienti + scarto + lavoro per pasto
  primeCostPercentuale: number         // Prime cost %
  // P&L mensile
  ricavoNettoPremiumAdjusted: number   // Ricavo netto aggiustato con premium surcharge
  margineContributivo: number          // Ricavo netto - COGS
  margineContributivoPerc: number
  ebitdaMensile: number                // Utile operativo mensile (prima ammortamenti/tasse)
  ebitdaMarginPerc: number
  // Break-even
  breakEvenPastiGiorno: number
  // Risk flags
  risks: RiskItem[]
}

export interface RiskItem {
  livello: 'attenzione' | 'critico'
  messaggio: string
}

// ─── Simulator state (active scenario + globals + per-scenario overrides) ──────
export interface StatoSimulatore {
  scenarioAttivo: ScenarioId
  globali: {
    ivaPercentuale: number
    giorniOperativiMese: number
  }
  perScenario: Partial<Record<ScenarioId, Partial<SimulatorInputs>>>
}

// ─── Scenario default configs ───────────────────────────────────────────────────
export interface ScenarioConfig {
  id: ScenarioId
  nome: string
  descrizione: string
  tag: string
  isDarkKitchen: boolean
  defaults: SimulatorInputs
}
