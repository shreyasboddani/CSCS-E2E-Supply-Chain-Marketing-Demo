# Final demo flow

1. Open `/` to introduce the CSCS / SCOTI concept and the connected operational thread.
2. Scroll through connection, planning, warehouse, shipment visibility, and control-tower scenes. The planning chapter reads the actual current TS-600 replenishment requirement; warehouse and shipment scenes read receipt and shipment status.
3. Select **Enter the SCOTI demo** to enter `/demo/intro`.
4. Start the guided sandbox, then progress through Demand, Sourcing, Inbound, Orders, Fulfillment, Shipment, and Control Tower.
5. Use the guided actions to approve the requirement, confirm PO-1001, post RCPT-1001, allocate ORD-1001, pick and pack, dispatch SHP-1001, and advance delivery tracking. Every action is a deterministic domain transition over shared state.
6. Use the existing journey navigation to inspect linked operational views or select **Reset demo** to restore the canonical seed.

The demo is self-contained. All business data, entities, dates, and outcomes are simulated; the UI is an original concept rather than a production SCOTI interface.
