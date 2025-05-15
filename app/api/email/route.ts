import { NextResponse } from "next/server";
import * as Postmark from "postmark";

type EmailData = {
  recipient: string;
  ownerData: {
    name: string;
    companyName?: string;
    email: string;
    phone: string;
    address: string;
    contactDetails: string;
  };
  accommodationData: {
    name: string;
    address: string;
    postalCode: string;
    city: string;
    minPersonCount: number;
    maxPersonCount: number;
    petsAllowed: boolean;
    numberOfPetsAllowed: number;
    arrivalTime: string;
    departureTime: string;
    memo: string;
  };
  features: {
    featureID: number;
    value: string;
    name?: string; // Added for email display
  }[];
  rooms: {
    accommodationRoomType: number;
    floor: number;
    position: number;
    suffix: string;
  }[];
};

export async function POST(request: Request) {
  try {
    // Get email data from request
    const emailData = await request.json() as EmailData;
    
    if (!emailData.recipient || !emailData.ownerData || !emailData.accommodationData) {
      return NextResponse.json(
        { error: "Missing required data" }, 
        { status: 400 }
      );
    }

    // Initialize the Postmark client
    const apiKey = process.env.POSTMARK_API_KEY;
    if (!apiKey) {
      console.error("Missing Postmark API key in environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const client = new Postmark.ServerClient(apiKey);

    // Create HTML email with styling
    const emailHtml = createEmailHtml(emailData);
    
    // Send the email
    const result = await client.sendEmail({
      From: 'aanmelding@groepen.nl',
      To: emailData.recipient,
      Subject: 'Bedankt voor uw inschrijving bij Groepen.nl',
      HtmlBody: emailHtml,
      MessageStream: 'outbound'
    });

    console.log("Email sent successfully:", result);
    
    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      messageId: result.MessageID
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

function createEmailHtml(data: EmailData): string {
  // Map feature IDs to names for better display
  const featureNames: Record<number, string> = {
    1: "WiFi",
    2: "Zwembad",
    3: "Toilet",
    4: "Douche",
    5: "TV",
    6: "Bedden",
    7: "Vaatwasser",
    8: "Koelkast",
    9: "Inductiekookplaat",
    10: "Speeltoestellen",
    11: "Terras",
    12: "Parkeerplaats",
  };
  
  // Add names to features for display
  const featuresWithNames = data.features.map(feature => ({
    ...feature,
    name: featureNames[feature.featureID] || `Kenmerk ${feature.featureID}`
  }));

  // Define room types
  const roomTypes: Record<number, string> = {
    1: "Slaapkamer",
    2: "Badkamer",
    3: "Woonkamer",
    4: "Keuken",
    5: "Hal",
    6: "Overig"
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bedankt voor uw inschrijving</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .email-container {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 30px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header img {
      max-width: 200px;
      height: auto;
    }
    h1 {
      color: #2c5282;
      margin-top: 0;
    }
    h2 {
      color: #3182ce;
      font-size: 20px;
      margin-top: 30px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 10px;
    }
    .section {
      margin-bottom: 25px;
    }
    .property {
      margin-bottom: 8px;
    }
    .property-name {
      font-weight: bold;
      display: inline-block;
      width: 40%;
      vertical-align: top;
    }
    .property-value {
      display: inline-block;
      width: 58%;
    }
    .features-grid, .rooms-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-top: 15px;
    }
    .feature-item, .room-item {
      background-color: #f0f7ff;
      padding: 10px;
      border-radius: 6px;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      font-size: 14px;
      color: #718096;
    }
    @media only screen and (max-width: 480px) {
      body {
        padding: 10px;
      }
      .email-container {
        padding: 15px;
      }
      .property-name, .property-value {
        width: 100%;
        display: block;
      }
      .features-grid, .rooms-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://groepen.nl/assets/logo-groepen-nl.png" alt="Groepen.nl Logo">
      <h1>Bedankt voor uw inschrijving!</h1>
    </div>
    
    <p>Beste ${data.ownerData.name},</p>
    
    <p>Hartelijk dank voor het inschrijven van uw accommodatie bij Groepen.nl. Hieronder vindt u een overzicht van de gegevens die u heeft ingevuld.</p>
    
    <h2>Eigenaar Gegevens</h2>
    <div class="section">
      <div class="property">
        <span class="property-name">Naam:</span>
        <span class="property-value">${data.ownerData.name}</span>
      </div>
      ${data.ownerData.companyName ? `
      <div class="property">
        <span class="property-name">Bedrijfsnaam:</span>
        <span class="property-value">${data.ownerData.companyName}</span>
      </div>
      ` : ''}
      <div class="property">
        <span class="property-name">E-mail:</span>
        <span class="property-value">${data.ownerData.email}</span>
      </div>
      <div class="property">
        <span class="property-name">Telefoon:</span>
        <span class="property-value">${data.ownerData.phone}</span>
      </div>
      <div class="property">
        <span class="property-name">Adres:</span>
        <span class="property-value">${data.ownerData.address}</span>
      </div>
      <div class="property">
        <span class="property-name">Contact details:</span>
        <span class="property-value">${data.ownerData.contactDetails}</span>
      </div>
    </div>
    
    <h2>Accommodatie Gegevens</h2>
    <div class="section">
      <div class="property">
        <span class="property-name">Naam:</span>
        <span class="property-value">${data.accommodationData.name}</span>
      </div>
      <div class="property">
        <span class="property-name">Adres:</span>
        <span class="property-value">${data.accommodationData.address}</span>
      </div>
      <div class="property">
        <span class="property-name">Postcode:</span>
        <span class="property-value">${data.accommodationData.postalCode}</span>
      </div>
      <div class="property">
        <span class="property-name">Plaats:</span>
        <span class="property-value">${data.accommodationData.city}</span>
      </div>
      <div class="property">
        <span class="property-name">Minimum aantal personen:</span>
        <span class="property-value">${data.accommodationData.minPersonCount}</span>
      </div>
      <div class="property">
        <span class="property-name">Maximum aantal personen:</span>
        <span class="property-value">${data.accommodationData.maxPersonCount}</span>
      </div>
      <div class="property">
        <span class="property-name">Huisdieren toegestaan:</span>
        <span class="property-value">${data.accommodationData.petsAllowed ? 'Ja' : 'Nee'}</span>
      </div>
      ${data.accommodationData.petsAllowed ? `
      <div class="property">
        <span class="property-name">Aantal huisdieren toegestaan:</span>
        <span class="property-value">${data.accommodationData.numberOfPetsAllowed}</span>
      </div>
      ` : ''}
      <div class="property">
        <span class="property-name">Aankomsttijd:</span>
        <span class="property-value">${data.accommodationData.arrivalTime}</span>
      </div>
      <div class="property">
        <span class="property-name">Vertrektijd:</span>
        <span class="property-value">${data.accommodationData.departureTime}</span>
      </div>
      <div class="property">
        <span class="property-name">Aanvullende informatie:</span>
        <span class="property-value">${data.accommodationData.memo || 'Geen'}</span>
      </div>
    </div>
    
    <h2>Kenmerken</h2>
    <div class="section">
      ${featuresWithNames.length > 0 ? `
        <div class="features-grid">
          ${featuresWithNames.map(feature => `
            <div class="feature-item">
              <strong>${feature.name}</strong>: ${feature.value}
            </div>
          `).join('')}
        </div>
      ` : '<p>Geen kenmerken opgegeven</p>'}
    </div>
    
    <h2>Kamers</h2>
    <div class="section">
      ${data.rooms.length > 0 ? `
        <div class="rooms-grid">
          ${data.rooms.map(room => `
            <div class="room-item">
              <strong>${roomTypes[room.accommodationRoomType] || 'Kamer'} ${room.suffix}</strong><br>
              Verdieping: ${room.floor}, Positie: ${room.position}
            </div>
          `).join('')}
        </div>
      ` : '<p>Geen kamers opgegeven</p>'}
    </div>
    
    <div class="footer">
      <p>Ons team zal uw gegevens beoordelen en zo spoedig mogelijk contact met u opnemen.</p>
      <p>Met vriendelijke groet,<br>
      Het Groepen.nl team</p>
      <p>&copy; ${new Date().getFullYear()} Groepen.nl - Alle rechten voorbehouden</p>
    </div>
  </div>
</body>
</html>
  `;
}