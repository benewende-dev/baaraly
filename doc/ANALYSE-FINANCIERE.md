# Analyse financière Baaraly — Modèles gratuits & low-cost

## 1. Prix réels des modèles (OpenRouter, 2026)

| Modèle | Input/M | Output/M | Coût/run (50K in + 10K out) | Gratuit ? |
|--------|---------|----------|------------------------------|-----------|
| **Qwen 3.6 Plus** | $0 | $0 | **$0.00** | ✅ Oui |
| **MiniMax M2.5 (free)** | $0 | $0 | **$0.00** | ✅ Oui |
| **MiniMax M2.5 (payant)** | $0.20 | $1.17 | **$0.012** | ❌ |
| **Qwen 3.6 Plus Preview** | $0 | $0 | **$0.00** | ✅ Oui |
| **GPT-4o-mini** | $0.15 | $0.60 | **$0.008** | ❌ |
| **Claude Haiku 4** | $0.80 | $4.00 | **$0.044** | ❌ |
| **Claude Sonnet 4** | $3.00 | $15.00 | **$0.160** | ❌ |
| **DeepSeek V3** | $0.14 | $0.28 | **$0.008** | ❌ |

## 2. Stratégie : Modèles gratuits par défaut

Avec **Qwen 3.6 Plus** et **MiniMax M2.5 (free)** :

### Coût LLM = $0/run

| Plan | Runs/jour | Coût LLM/mois | Coût WA/mois | Coût total/user |
|------|-----------|---------------|--------------|-----------------|
| Pro | 50 | **$0** | $4 | **$4** |
| Max | 200 | **$0** | $10 | **$10** |

### Marge par user

| Plan | Revenu | Coût | Marge | Marge % |
|------|--------|------|-------|---------|
| Pro (30 000 FCFA) | $49 | $4 | **+$45** | **92%** |
| Max (95 000 FCFA) | $155 | $10 | **+$145** | **94%** |

## 3. Projection 10 → 1 000 users

### Hypothèse : 60% Pro, 30% Max, 10% Trading

| Users | Revenu/mois | Coûts LLM+WA | Coûts fixes | Marge nette |
|-------|-------------|--------------|-------------|-------------|
| 10 | 543 000 FCFA | 35 000 | 45 000 | **463 000 FCFA** |
| 50 | 2 715 000 | 175 000 | 45 000 | **2 495 000** |
| 100 | 5 430 000 | 350 000 | 45 000 | **5 035 000** |
| 250 | 13 575 000 | 875 000 | 60 000 | **12 640 000** |
| 500 | 27 150 000 | 1 750 000 | 75 000 | **25 325 000** |
| 1 000 | 54 300 000 | 3 500 000 | 100 000 | **50 700 000** |

### Détail à 100 users :
- **60 Pro** × 30 000 = 1 800 000 FCFA
- **30 Max** × 95 000 = 2 850 000 FCFA
- **10 Trading** × 95 000 = 950 000 FCFA
- **Total : 5 600 000 FCFA/mois**
- **Coûts LLM : ~350 000 FCFA** (modèles gratuits)
- **Coûts WhatsApp : ~100 000 FCFA**
- **Coûts fixes : ~45 000 FCFA** (serveurs)
- **Marge nette : ~5 100 000 FCFA/mois**

## 4. Comparaison avec vs sans modèles gratuits

| Scénario | 100 users | 1 000 users |
|----------|-----------|-------------|
| **Modèles gratuits (Qwen/MiniMax)** | +5.1M FCFA | +50.7M FCFA |
| GPT-4o-mini ($0.008/run) | +4.5M FCFA | +45M FCFA |
| Claude Sonnet ($0.16/run) | **-1.5M FCFA** ❌ | **-15M FCFA** ❌ |

## 5. Recommandation : Stratégie de modèles

### Par défaut (gratuit)
```
Pro : Qwen 3.6 Plus (free) ou MiniMax M2.5 (free)
Max : Qwen 3.6 Plus (free)
```

### En option (payant, upgrade)
```
Pro → Claude Haiku : +5 000 FCFA/mois
Max → Claude Sonnet : +20 000 FCFA/mois
```

### Fallback automatique
Si le modèle gratuit est surchargé ou down → bascule vers GPT-4o-mini ($0.008/run).

## 6. Conclusion

**Avec les modèles gratuits (Qwen 3.6 Plus, MiniMax M2.5 free) :**
- ✅ Marge Pro : **92%**
- ✅ Marge Max : **94%**
- ✅ Rentable dès **1 user**
- ✅ 100 users = **~5M FCFA/mois de marge**
- ✅ 1 000 users = **~50M FCFA/mois de marge**

**Les prix actuels sont PARFAITS avec les modèles gratuits.**
Pas besoin d'augmenter les prix ni de limiter les runs.
