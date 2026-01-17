Casi d’uso del sensore di peso (4 celle di carico + HX711)
1. Peso arnia stabile (condizione normale – livello semplice)
Il sensore rileva un peso complessivo dell’arnia stabile nel tempo, con variazioni molto ridotte (inferiori a circa ±0,5 kg al giorno).
Questo comportamento indica una situazione di equilibrio tra ingresso e consumo delle scorte.
Il sistema invia al server un messaggio di stato che segnala il normale funzionamento dell’arnia, senza condizioni critiche.

2. Accumulo di nettare (periodo di bottinatura – livello semplice)
Il sensore rileva un aumento progressivo del peso dell’arnia, tipicamente dell’ordine di 1–3 kg al giorno.
Questo fenomeno è associato all’attività di bottinatura e alla presenza di una fioritura attiva.
Il sistema invia al server un dato informativo che indica l’ingresso di nettare e una buona attività della colonia.

3. Consumo delle scorte (carestia o periodo invernale – livello medio)
Il sensore rileva una diminuzione graduale del peso dell’arnia, indicativamente tra 0,3 e 1 kg al giorno.
La variazione è dovuta al consumo delle scorte da parte delle api per il mantenimento della colonia.
Il sistema comunica al server che la colonia è in fase di consumo delle riserve.

4. Sciamatura avvenuta (livello medio)
Il sensore rileva un calo improvviso e significativo del peso dell’arnia, generalmente compreso tra 2 e 5 kg in un intervallo di tempo molto breve.
Questo evento è compatibile con l’uscita di una parte consistente della colonia.
Il sistema invia un alert al server segnalando una possibile sciamatura.

5. Intervento dell’apicoltore (livello medio)
Il sensore rileva una variazione rapida del peso, positiva o negativa, non compatibile con fenomeni biologici.
L’evento è tipicamente causato dall’apertura dell’arnia, dall’aggiunta o dalla rimozione di melari.
Il sistema registra l’evento e lo comunica al server come intervento umano.

6. Ribaltamento o spostamento dell’arnia (livello estremo)
Il sensore rileva una variazione molto elevata del peso o una perdita improvvisa della stabilità della misura.
Questo comportamento può indicare un ribaltamento o uno spostamento non previsto dell’arnia.
Il sistema genera un allarme di emergenza e lo invia al server.

7. Furto dell’arnia (livello estremo)
Il sensore rileva una riduzione drastica del peso fino a valori prossimi allo zero in un tempo molto breve.
Questo evento è compatibile con la rimozione completa dell’arnia dalla postazione.
Il sistema invia un allarme di furto al server.

8. Morte della colonia (conferma tramite sensore termico – livello estremo)
Il sensore di peso rileva un andamento quasi costante nel tempo, privo delle normali oscillazioni giornaliere.
Se questa condizione è confermata anche dal sensore di temperatura (assenza di termoregolazione), può indicare il collasso della colonia.
Il sistema invia un alert al server segnalando una possibile perdita della famiglia.