// @ts-ignore
import { promises as fs } from 'fs';
import path from 'path';
import xml2js from 'xml2js';
import { User } from '../types';
import {promisify} from 'util';
import zlib from 'zlib';

const inflateRawSync = promisify(zlib.inflateRawSync)

// Parse XML
const parseXML = (xml: string): Promise<Record<string, any>> => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (err: Error, result: any) => {
      if(err) {
        reject(err);
      }

      resolve(result);
    });
  });
};

// Parse SAMLRequest attributes
const extractSAMLRequestAttributes = async (samlRequest: string) => {
  // const request = await inflateRawSync(Buffer.from(samlRequest, 'base64')).toString();
  // const result = await parseXML(request);

  // const attributes = result['samlp:AuthnRequest']['$'];

  return {
    id: '123',
    acsUrl: 'https://hookb.in/NOrYqkDLnXse8mNNlDXx',
    providerName: 'BoxyHQ',
  };
};

const createIdPMetadataXML = async ({
  idpEntityId,
  idpSsoUrl,
  certificate,
}: {
  idpEntityId: string;
  idpSsoUrl: string;
  certificate: string;
}): Promise<string> => {
  const xmlPath = path.join('data', 'idp-metadata.xml');
  const xml = await fs.readFile(xmlPath, 'utf8');

  return xml
    .replace('idp_entity_id', idpEntityId)
    .replace('idp_certificate', extractCert(certificate))
    .replace(/idp_sso_url/g, idpSsoUrl);
};

const createCertificate = async () => {
  const certificateFilePath = path.join('data', 'x509cert.txt');

  return await fs.readFile(certificateFilePath, 'utf8');
};

const extractCert = (certificate: string) => {
  return certificate
    .replace('-----BEGIN CERTIFICATE-----', '')
    .replace('-----END CERTIFICATE-----', '')
    .trim();
};

// Create SAML Response XML
const createSAMLResponseXML = async (user: User): Promise<string> => {
  const xmlPath = path.join('data', 'saml-response.xml');
  const xml = await fs.readFile(xmlPath, 'utf8');

  return xml
    .replace(
      /idp_entity_id/g,
      'https://accounts.google.com/o/saml2?idpid=C02frd9s1'
    )
    .replace('sp_acs_url', 'some-url')
    .replace(/user_email/g, 'kiran@demo.com')
    .replace('user_firstName', 'Kiran')
    .replace('user_lastName', 'K');
};

export {
  parseXML,
  extractSAMLRequestAttributes,
  createIdPMetadataXML,
  createSAMLResponseXML,
  createCertificate,
  extractCert,
};