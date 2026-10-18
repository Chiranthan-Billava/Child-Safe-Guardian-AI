/* =============================================
   DATA.JS – Sample Data & localStorage Helpers
   ============================================= */

const CSA = (function() {

  // ── Sample Events ──
  const SAMPLE_EVENTS = [
    { event_id: 'EVT-001', name: 'Mysore Dasara Festival', venue: 'Mysore Palace Grounds', date: '2026-06-01', type: 'religious-festival', city: 'Mysore' },
    { event_id: 'EVT-002', name: 'Bangalore School Annual Day', venue: 'National High School, Basavanagudi', date: '2026-06-02', type: 'school-function', city: 'Bangalore' },
    { event_id: 'EVT-003', name: 'RNSIT College Technical Fest', venue: 'RNS Institute of Technology', date: '2026-06-02', type: 'college-fest', city: 'Bangalore' },
    { event_id: 'EVT-004', name: 'Karnataka Rajyotsava Community Fair', venue: 'Kanteerava Stadium', date: '2026-05-31', type: 'community-fair', city: 'Bangalore' },
    { event_id: 'EVT-005', name: 'Tirupathi Brahmotsavam', venue: 'Sri Venkateswara Temple', date: '2026-06-01', type: 'temple-festival', city: 'Tirupathi' },
    { event_id: 'EVT-006', name: 'Bengaluru Trade Expo', venue: 'BIEC Exhibition Centre', date: '2026-06-02', type: 'exhibition', city: 'Bangalore' },
  ];

  // ── Sample Volunteers ──
  const SAMPLE_VOLUNTEERS = [
    { volunteer_id: 'VOL-001', name: 'Rajesh Kumar', contact: '+91-9845001234', assigned_area: 'Main Gate Area', status: 'active', events_covered: 12, sightings_reported: 8, color: '#1a56db' },
    { volunteer_id: 'VOL-002', name: 'Priya Nair', contact: '+91-9876543210', assigned_area: 'North Zone', status: 'active', events_covered: 7, sightings_reported: 5, color: '#7c3aed' },
    { volunteer_id: 'VOL-003', name: 'Suresh Gowda', contact: '+91-9901234567', assigned_area: 'Food Court Zone', status: 'active', events_covered: 15, sightings_reported: 11, color: '#0891b2' },
    { volunteer_id: 'VOL-004', name: 'Anitha Reddy', contact: '+91-8765432109', assigned_area: 'East Entrance', status: 'active', events_covered: 9, sightings_reported: 3, color: '#059669' },
    { volunteer_id: 'VOL-005', name: 'Mohammed Imran', contact: '+91-9988776655', assigned_area: 'South Zone', status: 'on-break', events_covered: 6, sightings_reported: 7, color: '#dc2626' },
    { volunteer_id: 'VOL-006', name: 'Kavitha Sharma', contact: '+91-9123456789', assigned_area: 'Medical Point', status: 'active', events_covered: 11, sightings_reported: 4, color: '#d97706' },
    { volunteer_id: 'VOL-007', name: 'Arun Patel', contact: '+91-9000111222', assigned_area: 'Parking Zone', status: 'active', events_covered: 4, sightings_reported: 2, color: '#0f766e' },
    { volunteer_id: 'VOL-008', name: 'Deepa Krishnamurthy', contact: '+91-8900234567', assigned_area: 'Children Play Area', status: 'active', events_covered: 18, sightings_reported: 14, color: '#7e22ce' },
    { volunteer_id: 'VOL-009', name: 'Venkatesh Rao', contact: '+91-9800345678', assigned_area: 'West Gate', status: 'active', events_covered: 8, sightings_reported: 6, color: '#15803d' },
    { volunteer_id: 'VOL-010', name: 'Meena Sundaram', contact: '+91-9700456789', assigned_area: 'Information Desk', status: 'active', events_covered: 20, sightings_reported: 9, color: '#b45309' },
    { volunteer_id: 'VOL-011', name: 'Prakash Hegde', contact: '+91-9600567890', assigned_area: 'Stage Area', status: 'on-break', events_covered: 5, sightings_reported: 1, color: '#1d4ed8' },
    { volunteer_id: 'VOL-012', name: 'Lakshmi Devi', contact: '+91-9500678901', assigned_area: 'Temple Premises', status: 'active', events_covered: 22, sightings_reported: 16, color: '#9d174d' },
    { volunteer_id: 'VOL-013', name: 'Ganesh Murthy', contact: '+91-9400789012', assigned_area: 'North Gate', status: 'active', events_covered: 3, sightings_reported: 0, color: '#065f46' },
    { volunteer_id: 'VOL-014', name: 'Shaila Bhat', contact: '+91-9300890123', assigned_area: 'Lost & Found Counter', status: 'active', events_covered: 14, sightings_reported: 12, color: '#7c2d12' },
    { volunteer_id: 'VOL-015', name: 'Ravi Shankar', contact: '+91-9200901234', assigned_area: 'Central Plaza', status: 'active', events_covered: 10, sightings_reported: 7, color: '#1e3a5f' },
    { volunteer_id: 'VOL-016', name: 'Sindhu Prasad', contact: '+91-9100012345', assigned_area: 'Ride Area', status: 'active', events_covered: 6, sightings_reported: 3, color: '#5b21b6' },
    { volunteer_id: 'VOL-017', name: 'Kiran Babu', contact: '+91-9099123456', assigned_area: 'Exhibition Hall', status: 'on-break', events_covered: 7, sightings_reported: 4, color: '#134e4a' },
    { volunteer_id: 'VOL-018', name: 'Nalini Kamath', contact: '+91-9088234567', assigned_area: 'Dining Area', status: 'active', events_covered: 9, sightings_reported: 5, color: '#7f1d1d' },
    { volunteer_id: 'VOL-019', name: 'Shiva Kumar', contact: '+91-9077345678', assigned_area: 'Ticket Counter', status: 'active', events_covered: 11, sightings_reported: 8, color: '#0c4a6e' },
    { volunteer_id: 'VOL-020', name: 'Padma Venkat', contact: '+91-9066456789', assigned_area: 'Main Entrance', status: 'active', events_covered: 16, sightings_reported: 13, color: '#4c1d95' },
  ];

  // ── Sample Cases ──
  const SAMPLE_CASES = [
    {
      case_id: 'CSA-2026-001',
      child_name: 'Aryan Sharma',
      age: 7,
      gender: 'Male',
      parent_name: 'Rohit Sharma',
      parent_contact: '+91-9845001111',
      last_seen_location: 'Near Main Stage, Dasara Grounds',
      last_seen_time: '2026-06-02T10:30:00',
      clothing: 'Blue striped t-shirt, khaki shorts, white sneakers',
      notes: 'Has a small red backpack. Speaks Hindi and Kannada.',
      status: 'active',
      priority: true,
      event_id: 'EVT-001',
      reported_at: '2026-06-02T10:45:00',
      photo: null,
      photo_emoji: '👦',
      assigned_volunteer: 'VOL-001',
      updates: [],
    },
    {
      case_id: 'CSA-2026-002',
      child_name: 'Preethi Nair',
      age: 5,
      gender: 'Female',
      parent_name: 'Sunita Nair',
      parent_contact: '+91-9876500002',
      last_seen_location: 'Food Court, Kanteerava Stadium',
      last_seen_time: '2026-06-01T14:15:00',
      clothing: 'Pink frock with white flowers, pink sandals, pigtails',
      notes: 'Very shy, may not respond to strangers easily.',
      status: 'searching',
      priority: true,
      event_id: 'EVT-004',
      reported_at: '2026-06-01T14:30:00',
      photo: null,
      photo_emoji: '👧',
      assigned_volunteer: 'VOL-008',
      updates: [],
    },
    {
      case_id: 'CSA-2026-003',
      child_name: 'Rahul Gowda',
      age: 9,
      gender: 'Male',
      parent_name: 'Suresh Gowda',
      parent_contact: '+91-9901000003',
      last_seen_location: 'Ride Zone, Karnataka Fair',
      last_seen_time: '2026-06-01T16:00:00',
      clothing: 'Yellow jersey, dark jeans, black cap with logo',
      notes: 'Has glasses. Loves cricket.',
      status: 'investigating',
      priority: false,
      event_id: 'EVT-004',
      reported_at: '2026-06-01T16:20:00',
      photo: null,
      photo_emoji: '🧒',
      assigned_volunteer: 'VOL-003',
      updates: [],
    },
    {
      case_id: 'CSA-2026-004',
      child_name: 'Divya Reddy',
      age: 6,
      gender: 'Female',
      parent_name: 'Anitha Reddy',
      parent_contact: '+91-8765400004',
      last_seen_location: 'Temple Sanctum Entrance, Tirupathi',
      last_seen_time: '2026-06-02T08:00:00',
      clothing: 'Orange pattu pavada, gold anklets, red bindi',
      notes: 'Was with grandmother. Speaks Telugu only.',
      status: 'active',
      priority: true,
      event_id: 'EVT-005',
      reported_at: '2026-06-02T08:20:00',
      photo: null,
      photo_emoji: '👧',
      assigned_volunteer: 'VOL-012',
      updates: [],
    },
    {
      case_id: 'CSA-2026-005',
      child_name: 'Aditya Patel',
      age: 11,
      gender: 'Male',
      parent_name: 'Ravi Patel',
      parent_contact: '+91-9000500005',
      last_seen_location: 'Exhibition Hall B, BIEC',
      last_seen_time: '2026-06-02T11:45:00',
      clothing: 'White school uniform shirt, navy blue pants',
      notes: 'Was attending school trip. Teacher name: Mrs. Rekha.',
      status: 'searching',
      priority: false,
      event_id: 'EVT-006',
      reported_at: '2026-06-02T12:00:00',
      photo: null,
      photo_emoji: '🧒',
      assigned_volunteer: 'VOL-019',
      updates: [],
    },
    {
      case_id: 'CSA-2026-006',
      child_name: 'Sneha Krishnamurthy',
      age: 4,
      gender: 'Female',
      parent_name: 'Deepa Krishnamurthy',
      parent_contact: '+91-8900600006',
      last_seen_location: 'Puppet Show Area, Dasara Grounds',
      last_seen_time: '2026-06-02T09:10:00',
      clothing: 'Green and yellow lehenga, hair clip with stars',
      notes: 'Very young. Cannot state her full name clearly.',
      status: 'active',
      priority: true,
      event_id: 'EVT-001',
      reported_at: '2026-06-02T09:25:00',
      photo: null,
      photo_emoji: '👧',
      assigned_volunteer: 'VOL-008',
      updates: [],
    },
    {
      case_id: 'CSA-2026-007',
      child_name: 'Karthik Rao',
      age: 8,
      gender: 'Male',
      parent_name: 'Venkatesh Rao',
      parent_contact: '+91-9800700007',
      last_seen_location: 'Science Block, RNSIT College Fest',
      last_seen_time: '2026-06-02T13:30:00',
      clothing: 'Red Minecraft t-shirt, grey joggers, white socks',
      notes: 'Accompanied father to college fest.',
      status: 'investigating',
      priority: false,
      event_id: 'EVT-003',
      reported_at: '2026-06-02T13:50:00',
      photo: null,
      photo_emoji: '👦',
      assigned_volunteer: 'VOL-009',
      updates: [],
    },
    {
      case_id: 'CSA-2026-008',
      child_name: 'Manasa Hegde',
      age: 10,
      gender: 'Female',
      parent_name: 'Prakash Hegde',
      parent_contact: '+91-9600800008',
      last_seen_location: 'Auditorium Corridor, National High School',
      last_seen_time: '2026-06-02T15:00:00',
      clothing: 'School uniform – white shirt, blue skirt, black shoes',
      notes: 'Was performing in annual day. Stage costume may have changed.',
      status: 'searching',
      priority: false,
      event_id: 'EVT-002',
      reported_at: '2026-06-02T15:15:00',
      photo: null,
      photo_emoji: '👧',
      assigned_volunteer: 'VOL-011',
      updates: [],
    },
    {
      case_id: 'CSA-2026-009',
      child_name: 'Siddharth Bhat',
      age: 3,
      gender: 'Male',
      parent_name: 'Shaila Bhat',
      parent_contact: '+91-9300900009',
      last_seen_location: 'Near Temple Pond, Tirupathi',
      last_seen_time: '2026-06-02T07:30:00',
      clothing: 'Tiny dhoti and shirt (traditional), rubber sandals',
      notes: 'Toddler. Cannot communicate clearly.',
      status: 'active',
      priority: true,
      event_id: 'EVT-005',
      reported_at: '2026-06-02T07:45:00',
      photo: null,
      photo_emoji: '👦',
      assigned_volunteer: 'VOL-012',
      updates: [],
    },
    {
      case_id: 'CSA-2026-010',
      child_name: 'Riya Shankar',
      age: 12,
      gender: 'Female',
      parent_name: 'Ravi Shankar',
      parent_contact: '+91-9200010010',
      last_seen_location: 'Central Stage, Dasara Grounds',
      last_seen_time: '2026-06-02T11:00:00',
      clothing: 'Orange kurta, white palazzo pants, blue headband',
      notes: 'Was with school group. Group leader: Mr. Prasad.',
      status: 'searching',
      priority: false,
      event_id: 'EVT-001',
      reported_at: '2026-06-02T11:20:00',
      photo: null,
      photo_emoji: '👧',
      assigned_volunteer: 'VOL-015',
      updates: [],
    },
  ];

  // ── Sample Sightings ──
  const SAMPLE_SIGHTINGS = [
    { sighting_id: 'SIG-001', case_id: 'CSA-2026-001', location: 'Near Ice Cream Stall, North Zone', timestamp: '2026-06-02T11:00:00', description: 'Saw a child matching description near ice cream stall. Was crying.', contact: '+91-9800000001', verified: true },
    { sighting_id: 'SIG-002', case_id: 'CSA-2026-001', location: 'Toy Shop, East Market Area', timestamp: '2026-06-02T11:25:00', description: 'Child was standing alone looking at toys. Had blue backpack.', contact: '+91-9700000002', verified: true },
    { sighting_id: 'SIG-003', case_id: 'CSA-2026-002', location: 'Restroom Area, Food Court', timestamp: '2026-06-01T14:50:00', description: 'Pink frock girl seen near restroom entrance. Seemed lost.', contact: '+91-9600000003', verified: false },
    { sighting_id: 'SIG-004', case_id: 'CSA-2026-003', location: 'Security Post 3, East Gate', timestamp: '2026-06-01T16:45:00', description: 'Boy with yellow jersey and black cap was at our post. Taken to Lost & Found.', contact: '+91-9500000004', verified: true },
    { sighting_id: 'SIG-005', case_id: 'CSA-2026-004', location: 'Prasad Distribution Area', timestamp: '2026-06-02T08:45:00', description: 'Small girl in orange attire was alone here. Did not speak clearly.', contact: '+91-9400000005', verified: false },
    { sighting_id: 'SIG-006', case_id: 'CSA-2026-005', location: 'Hall C Entrance, BIEC', timestamp: '2026-06-02T12:20:00', description: 'Boy in school uniform seen looking at robotics display. Alone.', contact: '+91-9300000006', verified: true },
    { sighting_id: 'SIG-007', case_id: 'CSA-2026-006', location: 'Balloon Seller, Main Ground', timestamp: '2026-06-02T09:40:00', description: 'Little girl in green-yellow lehenga was standing near balloon stall.', contact: '+91-9200000007', verified: false },
    { sighting_id: 'SIG-008', case_id: 'CSA-2026-001', location: 'First Aid Post, Central', timestamp: '2026-06-02T11:50:00', description: 'A volunteer brought in a boy matching description. Checking ID.', contact: '+91-9100000008', verified: true },
    { sighting_id: 'SIG-009', case_id: 'CSA-2026-007', location: 'Canteen, Ground Floor, RNSIT', timestamp: '2026-06-02T14:00:00', description: 'Boy in red t-shirt was at the canteen. Asked for help finding father.', contact: '+91-9000000009', verified: true },
    { sighting_id: 'SIG-010', case_id: 'CSA-2026-008', location: 'Backstage, Auditorium', timestamp: '2026-06-02T15:30:00', description: 'A girl in school uniform was backstage. Crying. Handed to teacher.', contact: '+91-8900000010', verified: false },
    { sighting_id: 'SIG-011', case_id: 'CSA-2026-009', location: 'Near Temple Steps', timestamp: '2026-06-02T07:55:00', description: 'Toddler in traditional wear sitting on steps. No adult nearby.', contact: '+91-8800000011', verified: true },
    { sighting_id: 'SIG-012', case_id: 'CSA-2026-010', location: 'Cultural Program Seating Area', timestamp: '2026-06-02T11:35:00', description: 'Girl with orange kurta was sitting alone in back rows.', contact: '+91-8700000012', verified: false },
    { sighting_id: 'SIG-013', case_id: 'CSA-2026-002', location: 'Entry Gate 2, Kanteerava', timestamp: '2026-06-01T15:15:00', description: 'Pink frock girl near the gate. Was asking everyone for mama.', contact: '+91-8600000013', verified: true },
    { sighting_id: 'SIG-014', case_id: 'CSA-2026-003', location: 'Lost & Found Counter, Kanteerava', timestamp: '2026-06-01T17:00:00', description: 'Boy with glasses and yellow jersey brought to lost & found by security.', contact: '+91-8500000014', verified: true },
    { sighting_id: 'SIG-015', case_id: 'CSA-2026-006', location: 'Swings Area, Dasara Grounds', timestamp: '2026-06-02T09:55:00', description: 'Small girl in green-yellow dress playing alone at swings.', contact: '+91-8400000015', verified: false },
  ];

  // ── Sample Wristbands ──
  const SAMPLE_WRISTBANDS = [
    {
      wristband_id: 'WB-2026-0001', child_name: 'Aryan Sharma', child_age: 7, child_gender: 'Male', child_photo_emoji: '👦',
      guardian_name: 'Rohit Sharma', guardian_phone: '+91-9845001111', guardian_relation: 'Father',
      emergency_contact: '+91-9845009999', emergency_name: 'Sunita Sharma', emergency_relation: 'Mother',
      blood_group: 'B+', allergies: 'None', medical_notes: 'No known conditions',
      event_id: 'EVT-001', event_name: 'Mysore Dasara Festival', safe_radius: 100,
      registered_at: '2026-06-02T08:00:00', status: 'active',
      geofence_status: 'safe', last_lat: 12.3051, last_lng: 76.6551
    },
    {
      wristband_id: 'WB-2026-0002', child_name: 'Preethi Nair', child_age: 5, child_gender: 'Female', child_photo_emoji: '👧',
      guardian_name: 'Sunita Nair', guardian_phone: '+91-9876500002', guardian_relation: 'Mother',
      emergency_contact: '+91-9876509999', emergency_name: 'Vijay Nair', emergency_relation: 'Father',
      blood_group: 'O+', allergies: 'Peanuts', medical_notes: 'Carries epinephrine pen',
      event_id: 'EVT-004', event_name: 'Karnataka Rajyotsava Community Fair', safe_radius: 50,
      registered_at: '2026-06-01T09:30:00', status: 'active',
      geofence_status: 'breach', last_lat: 12.9780, last_lng: 77.5960
    },
    {
      wristband_id: 'WB-2026-0003', child_name: 'Rahul Gowda', child_age: 9, child_gender: 'Male', child_photo_emoji: '🧒',
      guardian_name: 'Suresh Gowda', guardian_phone: '+91-9901000003', guardian_relation: 'Father',
      emergency_contact: '+91-9901009999', emergency_name: 'Latha Gowda', emergency_relation: 'Mother',
      blood_group: 'A+', allergies: 'Dust', medical_notes: 'Wears glasses. Mild asthma.',
      event_id: 'EVT-004', event_name: 'Karnataka Rajyotsava Community Fair', safe_radius: 200,
      registered_at: '2026-06-01T10:15:00', status: 'active',
      geofence_status: 'warning', last_lat: 12.9785, last_lng: 77.5955
    },
    {
      wristband_id: 'WB-2026-0004', child_name: 'Divya Reddy', child_age: 6, child_gender: 'Female', child_photo_emoji: '👧',
      guardian_name: 'Anitha Reddy', guardian_phone: '+91-8765400004', guardian_relation: 'Mother',
      emergency_contact: '+91-8765409999', emergency_name: 'Ramesh Reddy', emergency_relation: 'Father',
      blood_group: 'AB+', allergies: 'None', medical_notes: 'Speaks Telugu only.',
      event_id: 'EVT-005', event_name: 'Tirupathi Brahmotsavam', safe_radius: 100,
      registered_at: '2026-06-02T06:45:00', status: 'active',
      geofence_status: 'safe', last_lat: 13.6833, last_lng: 79.3474
    },
    {
      wristband_id: 'WB-2026-0005', child_name: 'Sneha Krishnamurthy', child_age: 4, child_gender: 'Female', child_photo_emoji: '👧',
      guardian_name: 'Deepa Krishnamurthy', guardian_phone: '+91-8900600006', guardian_relation: 'Mother',
      emergency_contact: '+91-8900609999', emergency_name: 'Anil Krishnamurthy', emergency_relation: 'Father',
      blood_group: 'O-', allergies: 'Milk', medical_notes: 'Lactose intolerant. Very young, cannot state full name.',
      event_id: 'EVT-001', event_name: 'Mysore Dasara Festival', safe_radius: 50,
      registered_at: '2026-06-02T07:30:00', status: 'active',
      geofence_status: 'critical', last_lat: 12.3065, last_lng: 76.6570
    },
    {
      wristband_id: 'WB-2026-0006', child_name: 'Karthik Rao', child_age: 8, child_gender: 'Male', child_photo_emoji: '👦',
      guardian_name: 'Venkatesh Rao', guardian_phone: '+91-9800700007', guardian_relation: 'Father',
      emergency_contact: '+91-9800709999', emergency_name: 'Meera Rao', emergency_relation: 'Mother',
      blood_group: 'B-', allergies: 'None', medical_notes: 'No known conditions',
      event_id: 'EVT-003', event_name: 'RNSIT College Technical Fest', safe_radius: 150,
      registered_at: '2026-06-02T12:00:00', status: 'active',
      geofence_status: 'safe', last_lat: 12.9010, last_lng: 77.4950
    },
  ];

  // ── Sample Notifications ──
  const SAMPLE_NOTIFICATIONS = [
    { id: 'NTF-001', type: 'geofence', title: 'GeoFence Breach Detected', message: 'Preethi Nair has left the safe zone at Karnataka Rajyotsava Fair.', wristband_id: 'WB-2026-0002', timestamp: '2026-06-01T14:12:00', location: 'Food Court, Kanteerava Stadium', channels: ['sms','push','in-app'], read: false },
    { id: 'NTF-002', type: 'sighting', title: 'Volunteer Sighting Report', message: 'A volunteer reported seeing Preethi near the restroom area.', wristband_id: 'WB-2026-0002', timestamp: '2026-06-01T14:18:00', location: 'Restroom Area, Food Court', channels: ['push','in-app'], read: false },
    { id: 'NTF-003', type: 'qr-scan', title: 'QR Scan Detected', message: 'Wristband WB-2026-0005 was scanned near Puppet Show Area.', wristband_id: 'WB-2026-0005', timestamp: '2026-06-02T09:35:00', location: 'Puppet Show Area, Dasara Grounds', channels: ['sms','push','in-app'], read: false },
    { id: 'NTF-004', type: 'commander', title: 'Search Commander Update', message: 'AI Search Commander activated for Sneha Krishnamurthy. Priority zones assigned.', wristband_id: 'WB-2026-0005', timestamp: '2026-06-02T09:38:00', location: 'Command Center', channels: ['push','in-app'], read: true },
    { id: 'NTF-005', type: 'geofence', title: 'GeoFence Warning', message: 'Rahul Gowda approaching safe zone boundary at Karnataka Fair.', wristband_id: 'WB-2026-0003', timestamp: '2026-06-01T16:05:00', location: 'Ride Zone', channels: ['push','in-app'], read: true },
    { id: 'NTF-006', type: 'recovery', title: 'Child Located!', message: 'Rahul Gowda has been found at Lost & Found Counter. Recovery in progress.', wristband_id: 'WB-2026-0003', timestamp: '2026-06-01T17:02:00', location: 'Lost & Found Counter', channels: ['sms','push','email','in-app'], read: true },
    { id: 'NTF-007', type: 'sighting', title: 'Verified Sighting', message: 'Aryan Sharma spotted near Ice Cream Stall by volunteer VOL-001.', wristband_id: 'WB-2026-0001', timestamp: '2026-06-02T11:02:00', location: 'Near Ice Cream Stall, North Zone', channels: ['sms','push','in-app'], read: false },
    { id: 'NTF-008', type: 'qr-scan', title: 'QR Scan Detected', message: 'Wristband WB-2026-0001 scanned at First Aid Post.', wristband_id: 'WB-2026-0001', timestamp: '2026-06-02T11:50:00', location: 'First Aid Post, Central', channels: ['sms','push','in-app'], read: false },
    { id: 'NTF-009', type: 'commander', title: 'Volunteer Deployed', message: 'VOL-003 assigned to Food Court zone for Preethi Nair search.', wristband_id: 'WB-2026-0002', timestamp: '2026-06-01T14:22:00', location: 'Food Court Zone', channels: ['push','in-app'], read: true },
    { id: 'NTF-010', type: 'recovery', title: 'Recovery Completed', message: 'Preethi Nair reunited with guardian Sunita Nair. Case closed.', wristband_id: 'WB-2026-0002', timestamp: '2026-06-01T14:55:00', location: 'Entry Gate 2', channels: ['sms','push','email','in-app'], read: true },
  ];

  // ── Sample Recovery Timelines ──
  const SAMPLE_TIMELINES = {
    'WB-2026-0002': [
      { time: '2026-06-01T14:10:00', event: 'Child Reported Missing', type: 'report', source: 'Parent', icon: 'fa-circle-exclamation' },
      { time: '2026-06-01T14:12:00', event: 'GeoFence Breach Detected', type: 'geofence', source: 'System', icon: 'fa-location-crosshairs' },
      { time: '2026-06-01T14:15:00', event: 'AI Search Commander Activated', type: 'commander', source: 'System', icon: 'fa-brain' },
      { time: '2026-06-01T14:18:00', event: 'Volunteer VOL-003 Assigned', type: 'volunteer', source: 'Commander', icon: 'fa-user-shield' },
      { time: '2026-06-01T14:25:00', event: 'Sighting Report Received', type: 'sighting', source: 'Public', icon: 'fa-eye' },
      { time: '2026-06-01T14:30:00', event: 'Heatmap Updated', type: 'heatmap', source: 'System', icon: 'fa-fire' },
      { time: '2026-06-01T14:42:00', event: 'QR Scan at Entry Gate 2', type: 'qr-scan', source: 'Volunteer', icon: 'fa-qrcode' },
      { time: '2026-06-01T14:48:00', event: 'Parent Notified – Location Confirmed', type: 'notification', source: 'System', icon: 'fa-bell' },
      { time: '2026-06-01T14:55:00', event: 'Child Reunited with Guardian ✅', type: 'recovery', source: 'Volunteer', icon: 'fa-heart' },
    ],
    'WB-2026-0001': [
      { time: '2026-06-02T10:42:00', event: 'Child Reported Missing', type: 'report', source: 'Parent', icon: 'fa-circle-exclamation' },
      { time: '2026-06-02T10:44:00', event: 'GeoFence Breach Detected', type: 'geofence', source: 'System', icon: 'fa-location-crosshairs' },
      { time: '2026-06-02T10:46:00', event: 'AI Search Commander Activated', type: 'commander', source: 'System', icon: 'fa-brain' },
      { time: '2026-06-02T10:50:00', event: 'Volunteer VOL-001 Assigned', type: 'volunteer', source: 'Commander', icon: 'fa-user-shield' },
      { time: '2026-06-02T11:00:00', event: 'Sighting Near Ice Cream Stall', type: 'sighting', source: 'Public', icon: 'fa-eye' },
      { time: '2026-06-02T11:15:00', event: 'Heatmap Updated – North Zone Hot', type: 'heatmap', source: 'System', icon: 'fa-fire' },
      { time: '2026-06-02T11:50:00', event: 'QR Scan at First Aid Post', type: 'qr-scan', source: 'Volunteer', icon: 'fa-qrcode' },
    ],
  };

  // ── Sample Parent Accounts ──
  const SAMPLE_PARENTS = [
    {
      parent_id: 'PRT-001', full_name: 'Rohit Sharma', email: 'rohit@demo.com', mobile: '+91-9845001111',
      password: btoa('Password123'), address: '42, MG Road, Mysore, Karnataka 570001',
      emergency_name: 'Sunita Sharma', emergency_phone: '+91-9845009999', emergency_relation: 'Spouse',
      children: ['CHD-001', 'CHD-002'], verified: true, created_at: '2026-05-20T10:00:00',
      avatar_color: '#1a56db'
    },
    {
      parent_id: 'PRT-002', full_name: 'Sunita Nair', email: 'sunita@demo.com', mobile: '+91-9876500002',
      password: btoa('Password123'), address: '15, 3rd Cross, Jayanagar, Bangalore 560041',
      emergency_name: 'Vijay Nair', emergency_phone: '+91-9876509999', emergency_relation: 'Spouse',
      children: ['CHD-003'], verified: true, created_at: '2026-05-22T14:30:00',
      avatar_color: '#059669'
    },
    {
      parent_id: 'PRT-003', full_name: 'Anitha Reddy', email: 'anitha@demo.com', mobile: '+91-8765400004',
      password: btoa('Password123'), address: '88, Lakshmipuram, Tirupathi, AP 517501',
      emergency_name: 'Ramesh Reddy', emergency_phone: '+91-8765409999', emergency_relation: 'Spouse',
      children: ['CHD-004', 'CHD-005'], verified: true, created_at: '2026-05-25T09:15:00',
      avatar_color: '#7c3aed'
    },
  ];

  // ── Sample Child Profiles ──
  const SAMPLE_CHILDREN = [
    {
      child_id: 'CHD-001', parent_id: 'PRT-001', name: 'Aryan Sharma', age: 7, gender: 'Male', photo_emoji: '👦',
      blood_group: 'B+', allergies: 'None', medical_conditions: 'No known conditions', school_name: 'DPS Mysore',
      emergency_contacts: [{ name: 'Sunita Sharma', phone: '+91-9845009999', relation: 'Mother' }],
      wristband_id: 'WB-2026-0001', safety_status: 'safe',
      safe_zones: ['SZ-001'], created_at: '2026-05-20T10:15:00'
    },
    {
      child_id: 'CHD-002', parent_id: 'PRT-001', name: 'Sneha Krishnamurthy', age: 4, gender: 'Female', photo_emoji: '👧',
      blood_group: 'O-', allergies: 'Milk', medical_conditions: 'Lactose intolerant. Very young, cannot state full name.',
      school_name: 'Little Flower Nursery', emergency_contacts: [{ name: 'Deepa K', phone: '+91-8900600006', relation: 'Aunt' }],
      wristband_id: 'WB-2026-0005', safety_status: 'alert',
      safe_zones: ['SZ-002'], created_at: '2026-05-20T10:20:00'
    },
    {
      child_id: 'CHD-003', parent_id: 'PRT-002', name: 'Preethi Nair', age: 5, gender: 'Female', photo_emoji: '👧',
      blood_group: 'O+', allergies: 'Peanuts', medical_conditions: 'Carries epinephrine pen',
      school_name: 'Vidya Mandir, Jayanagar', emergency_contacts: [{ name: 'Vijay Nair', phone: '+91-9876509999', relation: 'Father' }],
      wristband_id: 'WB-2026-0002', safety_status: 'reunited',
      safe_zones: ['SZ-003'], created_at: '2026-05-22T14:45:00'
    },
    {
      child_id: 'CHD-004', parent_id: 'PRT-003', name: 'Divya Reddy', age: 6, gender: 'Female', photo_emoji: '👧',
      blood_group: 'AB+', allergies: 'None', medical_conditions: 'Speaks Telugu only.',
      school_name: 'Sri Vani School, Tirupathi', emergency_contacts: [{ name: 'Ramesh Reddy', phone: '+91-8765409999', relation: 'Father' }],
      wristband_id: 'WB-2026-0004', safety_status: 'safe',
      safe_zones: ['SZ-004'], created_at: '2026-05-25T09:30:00'
    },
    {
      child_id: 'CHD-005', parent_id: 'PRT-003', name: 'Karthik Rao', age: 8, gender: 'Male', photo_emoji: '👦',
      blood_group: 'B-', allergies: 'None', medical_conditions: 'No known conditions',
      school_name: 'St. Joseph School, Tirupathi', emergency_contacts: [{ name: 'Meera Rao', phone: '+91-9800709999', relation: 'Grandmother' }],
      wristband_id: 'WB-2026-0006', safety_status: 'safe',
      safe_zones: ['SZ-005'], created_at: '2026-05-25T09:35:00'
    },
  ];

  // ── Sample Safe Zones ──
  const SAMPLE_SAFE_ZONES = [
    { zone_id: 'SZ-001', child_id: 'CHD-001', parent_id: 'PRT-001', name: 'Dasara Festival Zone', type: 'festival', radius: 100, center_lat: 12.3051, center_lng: 76.6551, active: true, created_at: '2026-06-02T08:00:00' },
    { zone_id: 'SZ-002', child_id: 'CHD-002', parent_id: 'PRT-001', name: 'Dasara Kids Area', type: 'festival', radius: 50, center_lat: 12.3060, center_lng: 76.6560, active: true, created_at: '2026-06-02T07:30:00' },
    { zone_id: 'SZ-003', child_id: 'CHD-003', parent_id: 'PRT-002', name: 'Rajyotsava Fair Zone', type: 'festival', radius: 50, center_lat: 12.9780, center_lng: 77.5960, active: true, created_at: '2026-06-01T09:30:00' },
    { zone_id: 'SZ-004', child_id: 'CHD-004', parent_id: 'PRT-003', name: 'Temple Zone', type: 'home', radius: 100, center_lat: 13.6833, center_lng: 79.3474, active: true, created_at: '2026-06-02T06:45:00' },
    { zone_id: 'SZ-005', child_id: 'CHD-005', parent_id: 'PRT-003', name: 'College Fest Area', type: 'school', radius: 150, center_lat: 12.9010, center_lng: 77.4950, active: true, created_at: '2026-06-02T12:00:00' },
  ];

  // ── Sample Child History ──
  const SAMPLE_CHILD_HISTORY = {
    'CHD-001': [
      { type: 'registration', timestamp: '2026-06-02T08:00:00', location: 'Dasara Grounds', details: 'Wristband WB-2026-0001 registered' },
      { type: 'geofence', timestamp: '2026-06-02T10:44:00', location: 'Main Stage', details: 'GeoFence breach detected – child left safe zone' },
      { type: 'alert', timestamp: '2026-06-02T10:45:00', location: 'Dasara Grounds', details: 'Emergency alert triggered by parent' },
      { type: 'sighting', timestamp: '2026-06-02T11:02:00', location: 'Ice Cream Stall', details: 'Volunteer sighting reported' },
      { type: 'qr_scan', timestamp: '2026-06-02T11:50:00', location: 'First Aid Post', details: 'QR wristband scanned' },
      { type: 'tracking', timestamp: '2026-06-02T12:00:00', location: 'Near Gate 3', details: 'Live tracking active' },
    ],
    'CHD-002': [
      { type: 'registration', timestamp: '2026-06-02T07:30:00', location: 'Dasara Grounds', details: 'Wristband WB-2026-0005 registered' },
      { type: 'geofence', timestamp: '2026-06-02T09:30:00', location: 'Puppet Show Area', details: 'GeoFence critical – child far from safe zone' },
      { type: 'qr_scan', timestamp: '2026-06-02T09:35:00', location: 'Puppet Show Area', details: 'QR wristband scanned by volunteer' },
      { type: 'alert', timestamp: '2026-06-02T09:38:00', location: 'Command Center', details: 'AI Commander activated' },
    ],
    'CHD-003': [
      { type: 'registration', timestamp: '2026-06-01T09:30:00', location: 'Kanteerava Stadium', details: 'Wristband WB-2026-0002 registered' },
      { type: 'geofence', timestamp: '2026-06-01T14:12:00', location: 'Food Court', details: 'GeoFence breach detected' },
      { type: 'sighting', timestamp: '2026-06-01T14:25:00', location: 'Restroom Area', details: 'Sighting reported by public' },
      { type: 'qr_scan', timestamp: '2026-06-01T14:42:00', location: 'Entry Gate 2', details: 'QR scanned by volunteer' },
      { type: 'recovery', timestamp: '2026-06-01T14:55:00', location: 'Entry Gate 2', details: 'Child reunited with guardian Sunita Nair' },
    ],
    'CHD-004': [
      { type: 'registration', timestamp: '2026-06-02T06:45:00', location: 'Tirupathi Temple', details: 'Wristband WB-2026-0004 registered' },
      { type: 'tracking', timestamp: '2026-06-02T08:00:00', location: 'Temple Premises', details: 'Live tracking active – inside safe zone' },
    ],
    'CHD-005': [
      { type: 'registration', timestamp: '2026-06-02T12:00:00', location: 'RNSIT Campus', details: 'Wristband WB-2026-0006 registered' },
      { type: 'tracking', timestamp: '2026-06-02T12:30:00', location: 'Exhibition Hall', details: 'Live tracking active – inside safe zone' },
    ],
  };

  // ── Sample Trusted Guardians ──
  const SAMPLE_GUARDIANS = [
    {
      guardian_id: 'GRD-001', parent_id: 'PRT-001', child_ids: ['CHD-001', 'CHD-002'],
      full_name: 'Sunita Sharma', relationship: 'Mother', mobile: '+91-9845009999',
      email: 'sunita.sharma@demo.com', address: '42, MG Road, Mysore',
      id_type: 'Aadhaar', id_number: 'XXXX-XXXX-1234', priority: 'primary',
      photo_emoji: '👩', status: 'verified', availability: 'available',
      recovery_count: 3, last_recovery: '2026-05-28T14:30:00', avg_response_mins: 8,
      qr_code: 'GRD-VER-001', created_at: '2026-05-20T10:05:00'
    },
    {
      guardian_id: 'GRD-002', parent_id: 'PRT-001', child_ids: ['CHD-001'],
      full_name: 'Rajesh Sharma', relationship: 'Uncle', mobile: '+91-9845008888',
      email: 'rajesh.sharma@demo.com', address: '15, KR Road, Mysore',
      id_type: 'Aadhaar', id_number: 'XXXX-XXXX-5678', priority: 'secondary',
      photo_emoji: '👨', status: 'verified', availability: 'available',
      recovery_count: 1, last_recovery: '2026-05-15T11:00:00', avg_response_mins: 12,
      qr_code: 'GRD-VER-002', created_at: '2026-05-21T09:30:00'
    },
    {
      guardian_id: 'GRD-003', parent_id: 'PRT-001', child_ids: ['CHD-001', 'CHD-002'],
      full_name: 'Meena Devi', relationship: 'Grandmother', mobile: '+91-9845007777',
      email: '', address: '42, MG Road, Mysore',
      id_type: 'Voter ID', id_number: 'KAR-12345678', priority: 'secondary',
      photo_emoji: '👵', status: 'verified', availability: 'busy',
      recovery_count: 2, last_recovery: '2026-05-25T16:45:00', avg_response_mins: 15,
      qr_code: 'GRD-VER-003', created_at: '2026-05-20T10:10:00'
    },
    {
      guardian_id: 'GRD-004', parent_id: 'PRT-002', child_ids: ['CHD-003'],
      full_name: 'Vijay Nair', relationship: 'Father', mobile: '+91-9876509999',
      email: 'vijay.nair@demo.com', address: '15, 3rd Cross, Jayanagar, Bangalore',
      id_type: 'Aadhaar', id_number: 'XXXX-XXXX-9012', priority: 'primary',
      photo_emoji: '👨', status: 'verified', availability: 'available',
      recovery_count: 2, last_recovery: '2026-06-01T14:55:00', avg_response_mins: 6,
      qr_code: 'GRD-VER-004', created_at: '2026-05-22T14:35:00'
    },
    {
      guardian_id: 'GRD-005', parent_id: 'PRT-002', child_ids: ['CHD-003'],
      full_name: 'Lakshmi Nair', relationship: 'Grandmother', mobile: '+91-9876508888',
      email: '', address: '22, 5th Main, Jayanagar, Bangalore',
      id_type: 'Aadhaar', id_number: 'XXXX-XXXX-3456', priority: 'secondary',
      photo_emoji: '👵', status: 'verified', availability: 'available',
      recovery_count: 0, last_recovery: null, avg_response_mins: null,
      qr_code: 'GRD-VER-005', created_at: '2026-05-23T11:00:00'
    },
    {
      guardian_id: 'GRD-006', parent_id: 'PRT-003', child_ids: ['CHD-004', 'CHD-005'],
      full_name: 'Ramesh Reddy', relationship: 'Father', mobile: '+91-8765409999',
      email: 'ramesh.reddy@demo.com', address: '88, Lakshmipuram, Tirupathi',
      id_type: 'Aadhaar', id_number: 'XXXX-XXXX-7890', priority: 'primary',
      photo_emoji: '👨', status: 'verified', availability: 'available',
      recovery_count: 1, last_recovery: '2026-05-30T09:20:00', avg_response_mins: 10,
      qr_code: 'GRD-VER-006', created_at: '2026-05-25T09:20:00'
    },
    {
      guardian_id: 'GRD-007', parent_id: 'PRT-003', child_ids: ['CHD-004'],
      full_name: 'Padma Reddy', relationship: 'Aunt', mobile: '+91-8765408888',
      email: 'padma.r@demo.com', address: '90, Lakshmipuram, Tirupathi',
      id_type: 'Driving License', id_number: 'AP-DL-2020-1234', priority: 'secondary',
      photo_emoji: '👩', status: 'pending', availability: 'available',
      recovery_count: 0, last_recovery: null, avg_response_mins: null,
      qr_code: 'GRD-VER-007', created_at: '2026-05-26T10:30:00'
    },
    {
      guardian_id: 'GRD-008', parent_id: 'PRT-003', child_ids: ['CHD-005'],
      full_name: 'Meera Rao', relationship: 'Grandmother', mobile: '+91-9800709999',
      email: '', address: '12, Temple Street, Tirupathi',
      id_type: 'Voter ID', id_number: 'AP-98765432', priority: 'secondary',
      photo_emoji: '👵', status: 'verified', availability: 'unavailable',
      recovery_count: 1, last_recovery: '2026-05-22T17:00:00', avg_response_mins: 20,
      qr_code: 'GRD-VER-008', created_at: '2026-05-25T09:25:00'
    },
  ];

  // ── Sample Pickup / Recovery Records ──
  const SAMPLE_PICKUPS = [
    {
      pickup_id: 'PKP-001', child_id: 'CHD-003', guardian_id: 'GRD-004', case_id: 'CSA-2026-002',
      status: 'completed', created_at: '2026-06-01T14:50:00', verified_at: '2026-06-01T14:55:00',
      location: 'Entry Gate 2, Kanteerava Stadium', recovery_code: 'RC-4827',
      verification_method: 'qr_code', notes: 'Father verified via QR scan and Aadhaar check.'
    },
  ];

  // ── HELPERS ──

  function getAll(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch(e) { return []; }
  }

  function saveAll(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function init() {
    if (!localStorage.getItem('csa_initialized')) {
      saveAll('csa_cases', SAMPLE_CASES);
      saveAll('csa_volunteers', SAMPLE_VOLUNTEERS);
      saveAll('csa_sightings', SAMPLE_SIGHTINGS);
      saveAll('csa_events', SAMPLE_EVENTS);
      saveAll('csa_next_case_num', 11);
      localStorage.setItem('csa_initialized', 'true');
    }
    // Initialize new stores (additive – won't overwrite existing)
    if (!localStorage.getItem('csa_wristbands_init')) {
      saveAll('csa_wristbands', SAMPLE_WRISTBANDS);
      saveAll('csa_notifications', SAMPLE_NOTIFICATIONS);
      localStorage.setItem('csa_timelines', JSON.stringify(SAMPLE_TIMELINES));
      saveAll('csa_next_wb_num', 7);
      localStorage.setItem('csa_wristbands_init', 'true');
    }
    // Parent ecosystem stores
    if (!localStorage.getItem('csa_parents_init')) {
      saveAll('csa_parents', SAMPLE_PARENTS);
      saveAll('csa_children', SAMPLE_CHILDREN);
      saveAll('csa_safe_zones', SAMPLE_SAFE_ZONES);
      localStorage.setItem('csa_child_history', JSON.stringify(SAMPLE_CHILD_HISTORY));
      saveAll('csa_next_child_num', 6);
      saveAll('csa_next_parent_num', 4);
      saveAll('csa_next_sz_num', 6);
      localStorage.setItem('csa_parents_init', 'true');
    }
    // Guardian network stores
    if (!localStorage.getItem('csa_guardians_init')) {
      saveAll('csa_guardians', SAMPLE_GUARDIANS);
      saveAll('csa_pickups', SAMPLE_PICKUPS);
      saveAll('csa_next_guardian_num', 9);
      saveAll('csa_next_pickup_num', 2);
      localStorage.setItem('csa_guardians_init', 'true');
    }
  }

  function getCases()      { return getAll('csa_cases'); }
  function getVolunteers() { return getAll('csa_volunteers'); }
  function getSightings()  { return getAll('csa_sightings'); }
  function getEvents()     { return getAll('csa_events'); }

  // ── Wristband Methods ──
  function getWristbands()    { return getAll('csa_wristbands'); }
  function getWristbandById(id) { return getWristbands().find(w => w.wristband_id === id) || null; }

  function addWristband(data) {
    const wristbands = getWristbands();
    const num = parseInt(localStorage.getItem('csa_next_wb_num') || '7');
    const year = new Date().getFullYear();
    const wbId = `WB-${year}-${String(num).padStart(4, '0')}`;
    const newWB = {
      ...data,
      wristband_id: wbId,
      registered_at: new Date().toISOString(),
      status: 'active',
      geofence_status: 'safe',
      last_lat: 12.9716 + (Math.random() - 0.5) * 0.01,
      last_lng: 77.5946 + (Math.random() - 0.5) * 0.01,
    };
    wristbands.unshift(newWB);
    saveAll('csa_wristbands', wristbands);
    localStorage.setItem('csa_next_wb_num', num + 1);
    return newWB;
  }

  // ── Notification Methods ──
  function getNotifications() { return getAll('csa_notifications'); }

  function addNotification(data) {
    const notifs = getNotifications();
    const id = 'NTF-' + String(notifs.length + 1).padStart(3, '0');
    const n = { ...data, id, timestamp: new Date().toISOString(), read: false };
    notifs.unshift(n);
    saveAll('csa_notifications', notifs);
    return n;
  }

  function markNotificationRead(id) {
    const notifs = getNotifications();
    const idx = notifs.findIndex(n => n.id === id);
    if (idx !== -1) { notifs[idx].read = true; saveAll('csa_notifications', notifs); }
  }

  // ── Timeline Methods ──
  function getTimelines() {
    try { return JSON.parse(localStorage.getItem('csa_timelines') || '{}'); } catch(e) { return {}; }
  }

  function getTimeline(wristbandId) {
    const all = getTimelines();
    return all[wristbandId] || [];
  }

  function addTimelineEvent(wristbandId, eventData) {
    const all = getTimelines();
    if (!all[wristbandId]) all[wristbandId] = [];
    all[wristbandId].push({ ...eventData, time: new Date().toISOString() });
    localStorage.setItem('csa_timelines', JSON.stringify(all));
  }

  function getCaseById(id) {
    return getCases().find(c => c.case_id === id) || null;
  }

  function getSightingsForCase(caseId) {
    return getSightings().filter(s => s.case_id === caseId);
  }

  function addCase(caseData) {
    const cases = getCases();
    const num = parseInt(localStorage.getItem('csa_next_case_num') || '11');
    const year = new Date().getFullYear();
    const caseId = `CSA-${year}-${String(num).padStart(3, '0')}`;
    const newCase = {
      ...caseData,
      case_id: caseId,
      reported_at: new Date().toISOString(),
      status: 'active',
      updates: [],
    };
    cases.unshift(newCase);
    saveAll('csa_cases', cases);
    localStorage.setItem('csa_next_case_num', num + 1);
    return newCase;
  }

  function addSighting(sightingData) {
    const sightings = getSightings();
    const id = 'SIG-' + String(sightings.length + 1).padStart(3, '0');
    const newSighting = {
      ...sightingData,
      sighting_id: id,
      timestamp: new Date().toISOString(),
      verified: false,
    };
    sightings.unshift(newSighting);
    saveAll('csa_sightings', sightings);

    // Also add to case updates
    const cases = getCases();
    const idx = cases.findIndex(c => c.case_id === sightingData.case_id);
    if (idx !== -1) {
      cases[idx].updates = cases[idx].updates || [];
      cases[idx].updates.unshift({
        type: 'sighting',
        time: new Date().toISOString(),
        description: `Sighting reported: ${sightingData.location}`,
      });
      saveAll('csa_cases', cases);
    }

    return newSighting;
  }

  function updateCaseStatus(caseId, newStatus) {
    const cases = getCases();
    const idx = cases.findIndex(c => c.case_id === caseId);
    if (idx === -1) return false;
    cases[idx].status = newStatus;
    cases[idx].updates = cases[idx].updates || [];
    cases[idx].updates.unshift({
      type: newStatus === 'found' ? 'found' : 'update',
      time: new Date().toISOString(),
      description: `Case status updated to: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
    });
    saveAll('csa_cases', cases);
    return true;
  }

  function verifySighting(sightingId) {
    const sightings = getSightings();
    const idx = sightings.findIndex(s => s.sighting_id === sightingId);
    if (idx !== -1) {
      sightings[idx].verified = true;
      saveAll('csa_sightings', sightings);
      return true;
    }
    return false;
  }

  // ── Stats ──
  function getStats() {
    const cases = getCases();
    const volunteers = getVolunteers();
    const sightings = getSightings();
    const wristbands = getWristbands();
    return {
      active:       cases.filter(c => ['active','searching','investigating'].includes(c.status)).length,
      reunited:     cases.filter(c => c.status === 'found').length,
      volunteers:   volunteers.filter(v => v.status === 'active').length,
      events:       getEvents().length,
      totalCases:   cases.length,
      sightings:    sightings.length,
      wristbands:   wristbands.length,
      activeWristbands: wristbands.filter(w => w.status === 'active').length,
    };
  }

  function timeAgo(isoString) {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 1)  return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  function formatTime(isoString) {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
  }

  function formatTimeShort(isoString) {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  function statusLabel(status) {
    const map = { active: 'Active', searching: 'Searching', investigating: 'Investigating', found: 'Found', closed: 'Closed' };
    return map[status] || status;
  }

  function statusClass(status) {
    const map = { active: 'badge-active', searching: 'badge-searching', investigating: 'badge-investigating', found: 'badge-found', closed: 'badge-closed' };
    return map[status] || 'badge-closed';
  }

  function getEventName(eventId) {
    const ev = getEvents().find(e => e.event_id === eventId);
    return ev ? ev.name : 'Unknown Event';
  }

  function reset() {
    localStorage.removeItem('csa_initialized');
    localStorage.removeItem('csa_wristbands_init');
    localStorage.removeItem('csa_parents_init');
    localStorage.removeItem('csa_session');
    init();
  }

  // ── Parent Auth Methods ──
  function getParents()      { return getAll('csa_parents'); }
  function getParentById(id) { return getParents().find(p => p.parent_id === id) || null; }

  function registerParent(data) {
    const parents = getParents();
    if (parents.find(p => p.email === data.email)) return { error: 'Email already registered' };
    if (parents.find(p => p.mobile === data.mobile)) return { error: 'Mobile already registered' };
    const num = parseInt(localStorage.getItem('csa_next_parent_num') || '4');
    const parent = {
      parent_id: `PRT-${String(num).padStart(3,'0')}`,
      full_name: data.full_name,
      email: data.email,
      mobile: data.mobile,
      password: btoa(data.password),
      address: data.address || '',
      emergency_name: data.emergency_name || '',
      emergency_phone: data.emergency_phone || '',
      emergency_relation: data.emergency_relation || '',
      children: [],
      verified: true,
      created_at: new Date().toISOString(),
      avatar_color: ['#1a56db','#059669','#7c3aed','#dc2626','#d97706','#0891b2'][num % 6],
    };
    parents.push(parent);
    saveAll('csa_parents', parents);
    localStorage.setItem('csa_next_parent_num', num + 1);
    return parent;
  }

  function loginParent(emailOrMobile, password) {
    const parents = getParents();
    const p = parents.find(p => (p.email === emailOrMobile || p.mobile === emailOrMobile) && atob(p.password) === password);
    if (!p) return null;
    const session = { parent_id: p.parent_id, token: 'tok_' + Date.now(), login_time: new Date().toISOString() };
    localStorage.setItem('csa_session', JSON.stringify(session));
    return p;
  }

  function logoutParent() {
    localStorage.removeItem('csa_session');
  }

  function getCurrentParent() {
    try {
      const session = JSON.parse(localStorage.getItem('csa_session'));
      if (!session || !session.parent_id) return null;
      return getParentById(session.parent_id);
    } catch(e) { return null; }
  }

  function isLoggedIn() {
    return getCurrentParent() !== null;
  }

  function updateParent(parentId, updates) {
    const parents = getParents();
    const idx = parents.findIndex(p => p.parent_id === parentId);
    if (idx === -1) return false;
    Object.assign(parents[idx], updates);
    saveAll('csa_parents', parents);
    return true;
  }

  function resetPassword(emailOrMobile, newPassword) {
    const parents = getParents();
    const idx = parents.findIndex(p => p.email === emailOrMobile || p.mobile === emailOrMobile);
    if (idx === -1) return false;
    parents[idx].password = btoa(newPassword);
    saveAll('csa_parents', parents);
    return true;
  }

  // ── Child Profile Methods ──
  function getChildrenAll()            { return getAll('csa_children'); }
  function getChildById(id)            { return getChildrenAll().find(c => c.child_id === id) || null; }
  function getChildrenForParent(pid)   { return getChildrenAll().filter(c => c.parent_id === pid); }

  function addChild(data) {
    const children = getChildrenAll();
    const num = parseInt(localStorage.getItem('csa_next_child_num') || '6');
    const child = {
      child_id: `CHD-${String(num).padStart(3,'0')}`,
      parent_id: data.parent_id,
      name: data.name,
      age: parseInt(data.age),
      gender: data.gender,
      photo_emoji: data.gender === 'Female' ? '👧' : '👦',
      blood_group: data.blood_group || '—',
      allergies: data.allergies || 'None',
      medical_conditions: data.medical_conditions || 'None',
      school_name: data.school_name || '—',
      emergency_contacts: data.emergency_contacts || [],
      wristband_id: null,
      safety_status: 'safe',
      safe_zones: [],
      created_at: new Date().toISOString(),
    };
    children.push(child);
    saveAll('csa_children', children);
    localStorage.setItem('csa_next_child_num', num + 1);
    // Link to parent
    const parents = getParents();
    const pidx = parents.findIndex(p => p.parent_id === data.parent_id);
    if (pidx !== -1) {
      parents[pidx].children.push(child.child_id);
      saveAll('csa_parents', parents);
    }
    return child;
  }

  function updateChild(childId, updates) {
    const children = getChildrenAll();
    const idx = children.findIndex(c => c.child_id === childId);
    if (idx === -1) return false;
    Object.assign(children[idx], updates);
    saveAll('csa_children', children);
    return true;
  }

  function removeChild(childId) {
    let children = getChildrenAll();
    const child = children.find(c => c.child_id === childId);
    if (!child) return false;
    children = children.filter(c => c.child_id !== childId);
    saveAll('csa_children', children);
    // Unlink from parent
    const parents = getParents();
    const pidx = parents.findIndex(p => p.parent_id === child.parent_id);
    if (pidx !== -1) {
      parents[pidx].children = parents[pidx].children.filter(id => id !== childId);
      saveAll('csa_parents', parents);
    }
    return true;
  }

  function updateChildStatus(childId, status) {
    return updateChild(childId, { safety_status: status });
  }

  // Map safety status for display
  function safetyStatusLabel(status) {
    const map = { safe: 'SAFE', inside: 'INSIDE SAFE ZONE', outside: 'OUTSIDE SAFE ZONE', tracking: 'TRACKING ACTIVE', alert: 'ALERT ACTIVE', located: 'CHILD LOCATED', reunited: 'REUNITED', sos_active: 'SOS EMERGENCY', tamper_alert: 'TAMPER DETECTED' };
    return map[status] || status?.toUpperCase() || 'UNKNOWN';
  }

  function safetyStatusColor(status) {
    const map = { safe: '#22c55e', inside: '#22c55e', outside: '#f59e0b', tracking: '#06b6d4', alert: '#ef4444', located: '#f97316', reunited: '#22c55e', sos_active: '#dc2626', tamper_alert: '#f97316' };
    return map[status] || '#64748b';
  }

  // ── Safe Zone Methods ──
  function getSafeZones()             { return getAll('csa_safe_zones'); }
  function getSafeZonesForChild(cid)  { return getSafeZones().filter(z => z.child_id === cid); }
  function getSafeZonesForParent(pid) { return getSafeZones().filter(z => z.parent_id === pid); }

  function addSafeZone(data) {
    const zones = getSafeZones();
    const num = parseInt(localStorage.getItem('csa_next_sz_num') || '6');
    const zone = {
      zone_id: `SZ-${String(num).padStart(3,'0')}`,
      child_id: data.child_id,
      parent_id: data.parent_id,
      name: data.name,
      type: data.type || 'custom',
      radius: parseInt(data.radius) || 100,
      center_lat: data.center_lat || 12.9716,
      center_lng: data.center_lng || 77.5946,
      active: true,
      created_at: new Date().toISOString(),
    };
    zones.push(zone);
    saveAll('csa_safe_zones', zones);
    localStorage.setItem('csa_next_sz_num', num + 1);
    // Link to child
    const child = getChildById(data.child_id);
    if (child) {
      updateChild(data.child_id, { safe_zones: [...(child.safe_zones||[]), zone.zone_id] });
    }
    return zone;
  }

  function removeSafeZone(zoneId) {
    let zones = getSafeZones();
    const zone = zones.find(z => z.zone_id === zoneId);
    if (!zone) return false;
    zones = zones.filter(z => z.zone_id !== zoneId);
    saveAll('csa_safe_zones', zones);
    // Unlink from child
    const child = getChildById(zone.child_id);
    if (child) {
      updateChild(zone.child_id, { safe_zones: (child.safe_zones||[]).filter(id => id !== zoneId) });
    }
    return true;
  }

  function updateSafeZone(zoneId, updates) {
    const zones = getSafeZones();
    const idx = zones.findIndex(z => z.zone_id === zoneId);
    if (idx === -1) return false;
    Object.assign(zones[idx], updates);
    saveAll('csa_safe_zones', zones);
    return true;
  }

  // ── Child History Methods ──
  function getChildHistoryAll() {
    try { return JSON.parse(localStorage.getItem('csa_child_history') || '{}'); } catch(e) { return {}; }
  }

  function getChildHistory(childId) {
    return getChildHistoryAll()[childId] || [];
  }

  function addChildHistoryEvent(childId, eventData) {
    const all = getChildHistoryAll();
    if (!all[childId]) all[childId] = [];
    all[childId].push({ ...eventData, timestamp: eventData.timestamp || new Date().toISOString() });
    localStorage.setItem('csa_child_history', JSON.stringify(all));
  }

  function getChildAnalytics(childId) {
    const history = getChildHistory(childId);
    const alerts = history.filter(h => h.type === 'alert' || h.type === 'geofence').length;
    const recoveries = history.filter(h => h.type === 'recovery').length;
    const scans = history.filter(h => h.type === 'qr_scan').length;
    const sightings = history.filter(h => h.type === 'sighting').length;
    const events = history.filter(h => h.type === 'registration').length;
    const safeHours = Math.floor(Math.random() * 200) + 50;
    return { total: history.length, alerts, recoveries, scans, sightings, events, safeHours, compliance: alerts === 0 ? 100 : Math.max(60, 100 - (alerts * 8)) };
  }

  // ── Emergency Trigger ──
  function triggerEmergency(childId) {
    const child = getChildById(childId);
    if (!child) return null;
    updateChildStatus(childId, 'alert');
    // Create case
    const parent = getParentById(child.parent_id);
    const wb = child.wristband_id ? getWristbandById(child.wristband_id) : null;
    const newCase = addCase({
      child_name: child.name, age: child.age, gender: child.gender,
      parent_name: parent ? parent.full_name : '—', parent_contact: parent ? parent.mobile : '—',
      last_seen_location: wb ? 'Last known wristband location' : 'Unknown',
      last_seen_time: new Date().toISOString(), clothing: '—',
      notes: `Emergency triggered from parent dashboard. Child ID: ${childId}`,
      priority: true, event_id: wb ? wb.event_id : '', photo_emoji: child.photo_emoji,
    });
    // Add notification
    addNotification({
      type: 'geofence', title: 'Emergency Alert Triggered',
      message: `Emergency panic button activated for ${child.name}. All units notified.`,
      wristband_id: child.wristband_id || '', location: 'Parent Dashboard',
      channels: ['sms','push','email','in-app'], priority: 'critical',
    });
    // Add history
    addChildHistoryEvent(childId, { type: 'alert', location: 'Parent Dashboard', details: `Emergency panic button activated. Case ${newCase.case_id} created.` });
    return newCase;
  }

  // ── Parent Stats ──
  function getParentStats(parentId) {
    const children = getChildrenForParent(parentId);
    const childIds = children.map(c => c.child_id);
    const wbIds = children.map(c => c.wristband_id).filter(Boolean);
    const wristbands = getWristbands().filter(w => wbIds.includes(w.wristband_id));
    const activeWB = wristbands.filter(w => w.status === 'active').length;
    const allNotifs = getNotifications().filter(n => wbIds.includes(n.wristband_id));
    const unread = allNotifs.filter(n => !n.read).length;
    const safeZones = getSafeZonesForParent(parentId).filter(z => z.active).length;
    const alerts = children.filter(c => c.safety_status === 'alert' || c.safety_status === 'outside').length;
    const recoveries = children.filter(c => c.safety_status === 'reunited').length;
    return { totalChildren: children.length, activeWristbands: activeWB, currentAlerts: alerts, safeZones, unread, recoveries };
  }

  // ── Trusted Guardian Methods ──
  function getGuardians()               { return getAll('csa_guardians'); }
  function getGuardianById(id)          { return getGuardians().find(g => g.guardian_id === id) || null; }
  function getGuardiansForParent(pid)   { return getGuardians().filter(g => g.parent_id === pid); }
  function getGuardiansForChild(cid)    { return getGuardians().filter(g => g.child_ids && g.child_ids.includes(cid)); }

  function addGuardian(data) {
    const guardians = getGuardians();
    const num = parseInt(localStorage.getItem('csa_next_guardian_num') || '9');
    const guardian = {
      guardian_id: `GRD-${String(num).padStart(3,'0')}`,
      parent_id: data.parent_id,
      child_ids: data.child_ids || [],
      full_name: data.full_name,
      relationship: data.relationship,
      mobile: data.mobile,
      email: data.email || '',
      address: data.address || '',
      id_type: data.id_type || '',
      id_number: data.id_number || '',
      priority: data.priority || 'secondary',
      photo_emoji: data.photo_emoji || '👤',
      status: 'pending',
      availability: 'available',
      recovery_count: 0,
      last_recovery: null,
      avg_response_mins: null,
      qr_code: `GRD-VER-${String(num).padStart(3,'0')}`,
      created_at: new Date().toISOString(),
    };
    guardians.push(guardian);
    saveAll('csa_guardians', guardians);
    localStorage.setItem('csa_next_guardian_num', num + 1);
    return guardian;
  }

  function updateGuardian(guardianId, updates) {
    const guardians = getGuardians();
    const idx = guardians.findIndex(g => g.guardian_id === guardianId);
    if (idx === -1) return false;
    Object.assign(guardians[idx], updates);
    saveAll('csa_guardians', guardians);
    return true;
  }

  function removeGuardian(guardianId) {
    let guardians = getGuardians();
    guardians = guardians.filter(g => g.guardian_id !== guardianId);
    saveAll('csa_guardians', guardians);
    return true;
  }

  function verifyGuardian(guardianId) {
    return updateGuardian(guardianId, { status: 'verified' });
  }

  function setGuardianAvailability(guardianId, availability) {
    return updateGuardian(guardianId, { availability });
  }

  // ── Pickup / Recovery Verification ──
  function getPickups()            { return getAll('csa_pickups'); }
  function getPickupsForChild(cid) { return getPickups().filter(p => p.child_id === cid); }

  function createPickupRequest(childId, guardianId, caseId) {
    const pickups = getPickups();
    const num = parseInt(localStorage.getItem('csa_next_pickup_num') || '2');
    const code = 'RC-' + String(1000 + Math.floor(Math.random() * 8999));
    const pickup = {
      pickup_id: `PKP-${String(num).padStart(3,'0')}`,
      child_id: childId,
      guardian_id: guardianId,
      case_id: caseId || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      verified_at: null,
      location: '',
      recovery_code: code,
      verification_method: null,
      notes: '',
    };
    pickups.push(pickup);
    saveAll('csa_pickups', pickups);
    localStorage.setItem('csa_next_pickup_num', num + 1);
    return pickup;
  }

  function completePickup(pickupId, data) {
    const pickups = getPickups();
    const idx = pickups.findIndex(p => p.pickup_id === pickupId);
    if (idx === -1) return false;
    pickups[idx].status = 'completed';
    pickups[idx].verified_at = new Date().toISOString();
    pickups[idx].location = data.location || '';
    pickups[idx].verification_method = data.verification_method || 'manual';
    pickups[idx].notes = data.notes || '';
    saveAll('csa_pickups', pickups);
    // Update guardian recovery count
    const g = getGuardianById(pickups[idx].guardian_id);
    if (g) {
      updateGuardian(g.guardian_id, {
        recovery_count: (g.recovery_count || 0) + 1,
        last_recovery: new Date().toISOString(),
      });
    }
    // Update child status
    updateChildStatus(pickups[idx].child_id, 'reunited');
    // History event
    addChildHistoryEvent(pickups[idx].child_id, {
      type: 'recovery',
      location: data.location || 'Recovery Center',
      details: `Secure pickup verified. Guardian: ${g ? g.full_name : 'Unknown'} (${g ? g.relationship : ''}). Verification: ${data.verification_method || 'manual'}.`,
    });
    return true;
  }

  // ── Guardian Analytics ──
  function getGuardianAnalytics(parentId) {
    const guardians = getGuardiansForParent(parentId);
    const pickups = getPickups();
    const gIds = guardians.map(g => g.guardian_id);
    const totalRecoveries = pickups.filter(p => gIds.includes(p.guardian_id) && p.status === 'completed').length;
    const avgResponse = guardians.filter(g => g.avg_response_mins).reduce((sum, g) => sum + g.avg_response_mins, 0);
    const respondentCount = guardians.filter(g => g.avg_response_mins).length;
    return {
      total: guardians.length,
      verified: guardians.filter(g => g.status === 'verified').length,
      pending: guardians.filter(g => g.status === 'pending').length,
      available: guardians.filter(g => g.availability === 'available').length,
      busy: guardians.filter(g => g.availability === 'busy').length,
      unavailable: guardians.filter(g => g.availability === 'unavailable').length,
      totalRecoveries,
      avgResponseMins: respondentCount > 0 ? Math.round(avgResponse / respondentCount) : 0,
    };
  }

  function getNearestGuardians(childId) {
    const guardians = getGuardiansForChild(childId).filter(g => g.status === 'verified');
    // Simulate distances
    return guardians.map(g => ({
      ...g,
      distance_m: Math.floor(Math.random() * 800) + 50,
      eta_mins: Math.floor(Math.random() * 15) + 2,
    })).sort((a, b) => a.distance_m - b.distance_m);
  }

  // ── Safety Score AI Engine ──
  function calculateSafetyScore(childId) {
    const child = getChildById(childId);
    if (!child) return { score: 0, label: 'Unknown', color: '#64748b', factors: [] };
    const wb = child.wristband_id ? getWristbandById(child.wristband_id) : null;
    const zones = getSafeZonesForChild(childId);
    const guardians = getGuardiansForChild(childId).filter(g => g.status === 'verified');
    const history = getChildHistory(childId);
    const recentAlerts = history.filter(h => (h.type === 'alert' || h.type === 'geofence') && (Date.now() - new Date(h.timestamp).getTime()) < 86400000);
    const factors = [];
    let score = 0;

    // Positive factors
    if (wb && wb.status === 'active') { score += 20; factors.push({ name: 'Wristband Active', value: '+20', positive: true }); }
    else { factors.push({ name: 'Wristband Inactive', value: '+0', positive: false }); }

    if (wb && wb.geofence_status === 'safe') { score += 20; factors.push({ name: 'Inside Safe Zone', value: '+20', positive: true }); }
    else if (wb && wb.geofence_status === 'warning') { score += 10; factors.push({ name: 'Near Zone Boundary', value: '+10', positive: false }); }
    else { factors.push({ name: 'Outside Safe Zone', value: '+0', positive: false }); }

    if (recentAlerts.length === 0) { score += 20; factors.push({ name: 'No Recent Alerts', value: '+20', positive: true }); }
    else { factors.push({ name: `${recentAlerts.length} Recent Alert(s)`, value: '+0', positive: false }); }

    if (guardians.length > 0) { score += 15; factors.push({ name: 'Verified Guardian Nearby', value: '+15', positive: true }); }
    else { factors.push({ name: 'No Verified Guardians', value: '+0', positive: false }); }

    if (child.safety_status === 'safe' || child.safety_status === 'inside') { score += 10; factors.push({ name: 'Parent Confirmed Safe', value: '+10', positive: true }); }

    if (child.safety_status !== 'sos_active') { score += 15; factors.push({ name: 'No SOS Active', value: '+15', positive: true }); }
    else { factors.push({ name: 'SOS Active', value: '+0', positive: false }); }

    // Deductions
    if (wb && (wb.geofence_status === 'breach' || wb.geofence_status === 'critical')) { score -= 25; factors.push({ name: 'GeoFence Breach', value: '-25', positive: false }); }
    if (wb && (wb.status === 'tampered' || wb.status === 'removed')) { score -= 30; factors.push({ name: 'Wristband Tampered/Removed', value: '-30', positive: false }); }
    if (child.safety_status === 'sos_active') { score -= 25; factors.push({ name: 'SOS Emergency Active', value: '-25', positive: false }); }
    if (child.safety_status === 'alert') { score -= 20; factors.push({ name: 'Emergency Alert Active', value: '-20', positive: false }); }
    if (wb && wb.status === 'offline') { score -= 15; factors.push({ name: 'Tracking Signal Lost', value: '-15', positive: false }); }

    score = Math.max(0, Math.min(100, score));
    let label, color;
    if (score >= 80) { label = 'Excellent'; color = '#22c55e'; }
    else if (score >= 60) { label = 'Good'; color = '#06b6d4'; }
    else if (score >= 40) { label = 'Moderate'; color = '#f59e0b'; }
    else if (score >= 20) { label = 'At Risk'; color = '#f97316'; }
    else { label = 'Critical'; color = '#ef4444'; }

    return { score, label, color, factors };
  }

  // ── Wristband Tamper Detection System ──
  function simulateTamperEvent(wristbandId) {
    const wristbands = getWristbands();
    const idx = wristbands.findIndex(w => w.wristband_id === wristbandId);
    if (idx === -1) return null;

    const tamperTypes = ['tampered', 'removed', 'offline'];
    const tamperType = tamperTypes[Math.floor(Math.random() * tamperTypes.length)];
    const tamperMessages = {
      tampered: 'Wristband sensor detected unusual physical interference.',
      removed: 'Wristband clasp opened. Child may have removed the device.',
      offline: 'Wristband signal lost. Device may be damaged or out of range.',
    };

    wristbands[idx].status = tamperType;
    wristbands[idx].tamper_time = new Date().toISOString();
    wristbands[idx].tamper_type = tamperType;
    saveAll('csa_wristbands', wristbands);

    // Update linked child status
    const children = getChildrenAll();
    const childIdx = children.findIndex(c => c.wristband_id === wristbandId);
    if (childIdx !== -1) {
      children[childIdx].safety_status = 'tamper_alert';
      saveAll('csa_children', children);
      addChildHistoryEvent(children[childIdx].child_id, {
        type: 'tamper',
        location: 'Wristband Sensor',
        details: `Tamper event: ${tamperType}. ${tamperMessages[tamperType]}`,
      });
    }

    // Create notification
    addNotification({
      type: 'tamper',
      title: 'Wristband Tamper Alert',
      message: `${wristbands[idx].child_name}'s wristband (${wristbandId}): ${tamperMessages[tamperType]}`,
      wristband_id: wristbandId,
      location: 'Wristband Sensor',
      channels: ['sms', 'push', 'in-app'],
      priority: 'high',
    });

    return { wristband: wristbands[idx], tamperType, message: tamperMessages[tamperType] };
  }

  function getWristbandHealth(wristbandId) {
    const wb = getWristbandById(wristbandId);
    if (!wb) return null;
    const batteryLevels = { active: 85 + Math.floor(Math.random() * 15), tampered: 40 + Math.floor(Math.random() * 30), removed: 60 + Math.floor(Math.random() * 20), offline: 0 };
    const signalLevels = { active: 'strong', tampered: 'weak', removed: 'none', offline: 'none' };
    return {
      wristband_id: wristbandId,
      child_name: wb.child_name,
      status: wb.status,
      battery: batteryLevels[wb.status] || 50,
      signal: signalLevels[wb.status] || 'unknown',
      tamper_detected: wb.status === 'tampered' || wb.status === 'removed',
      last_active: wb.tamper_time || wb.registered_at,
      geofence_status: wb.geofence_status,
    };
  }

  function resetWristband(wristbandId) {
    const wristbands = getWristbands();
    const idx = wristbands.findIndex(w => w.wristband_id === wristbandId);
    if (idx === -1) return false;
    wristbands[idx].status = 'active';
    delete wristbands[idx].tamper_time;
    delete wristbands[idx].tamper_type;
    saveAll('csa_wristbands', wristbands);
    // Reset child status
    const children = getChildrenAll();
    const childIdx = children.findIndex(c => c.wristband_id === wristbandId);
    if (childIdx !== -1) {
      children[childIdx].safety_status = 'safe';
      saveAll('csa_children', children);
    }
    addNotification({
      type: 'recovery',
      title: 'Wristband Restored',
      message: `Wristband ${wristbandId} has been reset and is now active.`,
      wristband_id: wristbandId,
      location: 'System',
      channels: ['push', 'in-app'],
    });
    return true;
  }

  // ── SOS Emergency System ──
  function triggerSOSEmergency(childId) {
    const child = getChildById(childId);
    if (!child) return null;
    updateChildStatus(childId, 'sos_active');
    const parent = getParentById(child.parent_id);
    const wb = child.wristband_id ? getWristbandById(child.wristband_id) : null;
    const newCase = addCase({
      child_name: child.name, age: child.age, gender: child.gender,
      parent_name: parent ? parent.full_name : '—', parent_contact: parent ? parent.mobile : '—',
      last_seen_location: wb ? `Last wristband location (${wb.geofence_status})` : 'Unknown',
      last_seen_time: new Date().toISOString(), clothing: '—',
      notes: `🆘 SOS EMERGENCY triggered via wristband. Child ID: ${childId}. CRITICAL PRIORITY.`,
      priority: true, event_id: wb ? wb.event_id : '', photo_emoji: child.photo_emoji,
    });
    // Mark case as SOS
    const cases = getCases();
    const caseIdx = cases.findIndex(c => c.case_id === newCase.case_id);
    if (caseIdx !== -1) {
      cases[caseIdx].sos = true;
      cases[caseIdx].sos_triggered_at = new Date().toISOString();
      cases[caseIdx].sos_status = 'active';
      saveAll('csa_cases', cases);
    }
    // Multi-channel critical notification
    addNotification({
      type: 'sos',
      title: '🆘 SOS EMERGENCY',
      message: `SOS emergency for ${child.name}! All volunteers and guardians alerted. Case: ${newCase.case_id}`,
      wristband_id: child.wristband_id || '',
      location: wb ? 'Last Wristband Location' : 'Unknown',
      channels: ['sms', 'push', 'email', 'in-app', 'loudspeaker'],
      priority: 'critical',
    });
    addChildHistoryEvent(childId, {
      type: 'sos',
      location: 'Parent Dashboard',
      details: `SOS EMERGENCY triggered. Case ${newCase.case_id} created with CRITICAL priority.`,
    });
    return newCase;
  }

  function getActiveSOSCases() {
    return getCases().filter(c => c.sos && c.sos_status === 'active');
  }

  function resolveSOSCase(caseId) {
    const cases = getCases();
    const idx = cases.findIndex(c => c.case_id === caseId);
    if (idx === -1) return false;
    cases[idx].sos_status = 'resolved';
    cases[idx].sos_resolved_at = new Date().toISOString();
    cases[idx].status = 'found';
    saveAll('csa_cases', cases);
    addNotification({
      type: 'recovery',
      title: 'SOS Emergency Resolved',
      message: `SOS case ${caseId} has been resolved. Child is safe.`,
      wristband_id: '',
      location: 'Command Center',
      channels: ['sms', 'push', 'email', 'in-app'],
    });
    return true;
  }

  return {
    init, reset,
    getCases, getVolunteers, getSightings, getEvents,
    getCaseById, getSightingsForCase,
    addCase, addSighting, updateCaseStatus, verifySighting,
    getStats, timeAgo, formatTime, formatTimeShort, statusLabel, statusClass, getEventName,
    // Wristband modules
    getWristbands, getWristbandById, addWristband,
    getNotifications, addNotification, markNotificationRead,
    getTimelines, getTimeline, addTimelineEvent,
    // Parent ecosystem
    getParents, getParentById, registerParent, loginParent, logoutParent, getCurrentParent, isLoggedIn, updateParent, resetPassword,
    getChildrenAll, getChildById, getChildrenForParent, addChild, updateChild, removeChild, updateChildStatus,
    safetyStatusLabel, safetyStatusColor,
    getSafeZones, getSafeZonesForChild, getSafeZonesForParent, addSafeZone, removeSafeZone, updateSafeZone,
    getChildHistory, addChildHistoryEvent, getChildAnalytics,
    triggerEmergency, getParentStats,
    // Trusted Guardian Network
    getGuardians, getGuardianById, getGuardiansForParent, getGuardiansForChild,
    addGuardian, updateGuardian, removeGuardian, verifyGuardian, setGuardianAvailability,
    getPickups, getPickupsForChild, createPickupRequest, completePickup,
    getGuardianAnalytics, getNearestGuardians,
    // Safety Score AI
    calculateSafetyScore,
    // Wristband Tamper Detection
    simulateTamperEvent, getWristbandHealth, resetWristband,
    // SOS Emergency System
    triggerSOSEmergency, getActiveSOSCases, resolveSOSCase,
  };

})();

// Auto-initialize on load
document.addEventListener('DOMContentLoaded', () => CSA.init());
