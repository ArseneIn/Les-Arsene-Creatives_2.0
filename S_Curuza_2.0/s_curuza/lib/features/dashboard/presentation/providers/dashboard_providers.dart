import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../domain/models.dart';

part 'dashboard_providers.g.dart';

@riverpod
DashboardStats dummyDashboardStats(Ref ref) {
  return const DashboardStats(
    totalSalesStr: 'UGX 4.2M',
    salesGrowthStr: '+12.4%',
    stockValueStr: 'UGX 18.8M',
    totalStockItems: 1240,
    outstandingDebtStr: 'UGX 842K',
    pendingDebts: 8,
    revenueYieldStr: '24.5%',
  );
}

@riverpod
List<Transaction> dummyRecentTransactions(Ref ref) {
  return const [
    Transaction(id: '#TR-88219', customerName: 'Sarah Nabirye', paymentMethod: 'Cash', amountStr: 'UGX 45,000'),
    Transaction(id: '#TR-88218', customerName: 'John Kato', paymentMethod: 'MoMo', amountStr: 'UGX 125,000'),
    Transaction(id: '#TR-88217', customerName: 'Aisha Namukasa', paymentMethod: 'MoMo', amountStr: 'UGX 8,500'),
    Transaction(id: '#TR-88216', customerName: 'Emmanuel Okello', paymentMethod: 'Cash', amountStr: 'UGX 22,000'),
  ];
}

@riverpod
List<InventoryAlert> dummyInventoryAlerts(Ref ref) {
  return const [
    InventoryAlert(
      itemName: '50kg Maize Flour',
      severityLevel: 'Critical',
      alertMessage: 'Low Stock: Only 3 bags left',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdcEqZQVvMABPqhqBYGX1COdpKmNQ-hCTg_xyQmj0WQAIm1WeN7ROy7OqZiGRw539rjI5Ffl6O_RZyYLlwZOC4TR3yiYd1Eih6CkXFb2KzJbtfvNMmhRUkXdoB_q5H9ZYtivIHyrqsQEVqB1WXtDcGvXIbwYBtyKnSDM3YjmQNtPwpqNP3QJH3jiaHgYTn7DXLl24OuhWziUD97I3P3s3uz2-TpxJaIKYaVarnKIrWMRC_e3z3jlgWu3-_0iaD0kXtWd6zLr89bA',
    ),
  ];
}

@riverpod
List<InventoryItemSnapshot> dummyInventorySnapshot(Ref ref) {
  return const [
    InventoryItemSnapshot(
      name: 'Maize Flour',
      grade: 'Premium Grade',
      quantityStr: '3 bags',
      statusColor: 'error',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdcEqZQVvMABPqhqBYGX1COdpKmNQ-hCTg_xyQmj0WQAIm1WeN7ROy7OqZiGRw539rjI5Ffl6O_RZyYLlwZOC4TR3yiYd1Eih6CkXFb2KzJbtfvNMmhRUkXdoB_q5H9ZYtivIHyrqsQEVqB1WXtDcGvXIbwYBtyKnSDM3YjmQNtPwpqNP3QJH3jiaHgYTn7DXLl24OuhWziUD97I3P3s3uz2-TpxJaIKYaVarnKIrWMRC_e3z3jlgWu3-_0iaD0kXtWd6zLr89bA',
    ),
    InventoryItemSnapshot(
      name: 'Basmati Rice',
      grade: '25kg Sack',
      quantityStr: '42 bags',
      statusColor: 'emerald',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-zIby1evzse2dVedjSikNh9Eh6rXTasaziHe98ogxwOkiYbXi9fwDQd8fUJawkS-H-Jr2Z8Hoh__orOy-Fo9IWosVShb-EVFypZ22xrVm7Tnf8k8Am2kQ1Zy_7CGyOZ-QALtXoxTEyHdOu134Z5IgoShVuz4xLcQ8Qtbur0cLSrw0rCoNp1IyZyXrrH4Z0n4mmC1OE3rQm723LOTTaa2aL0DfWtS5AfPpjlqtwkt_9I6FlLbC8HKa71j3a0d9yXu6lcjwd8sGbA',
    ),
    InventoryItemSnapshot(
      name: 'Cooking Oil',
      grade: '5L Jerrycans',
      quantityStr: '15 units',
      statusColor: 'secondary',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAsreDIH6F-WUvdAcB29gJwx_yYdZ0O0BA0U0U1hP--cm58UhZDmS559tIpf3-MEmkyxuqi4Wjt3oAFAwXwduTIzoiRgpr-Av0JuZbg4hP8pQ6j6l2_WVyW7F4ca2OsvY-ya4529JFRQ8Pc_rAlKbsAuIh5pOdgcHlKCJDxFKj8wbNkowGYYenMJReIl5WgRlA0VHLsBkFIJl_P-SsbuEypJgG8UdwYJYQA4Qj4cXkoqSmt90EQIISAEPE1odd3XmE0bHQTzwrog',
    ),
  ];
}
