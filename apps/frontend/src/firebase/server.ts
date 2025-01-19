import type { ServiceAccount } from 'firebase-admin';
import { cert, getApps, initializeApp } from 'firebase-admin/app';

const activeApps = getApps();
const serviceAccount = {
   type: 'service_account',
   project_id: 'decodeit-f84ea',
   private_key_id: '93244c92b5381aa3f64d7b45cfd5b50ff9c582d9',
   private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDBFdmTVGedpIad\nOrNEjA0+0Fp+G0BDb6FQl2cFWQEhE1fu4HxrkKx5kJ0rXSpOCqwtvSdmKoAOPQqW\nt5agXnkihtzVrpYATLvCH66RS7uUiOAWRbvKVwB4RTbur0MgHXbVFc0psgcq7pUn\nUvb7T7Q0NS9X1oK4XP6Q7uueIZxyoEVjUrCp/GiQZg108nviaj6XOn27nT50QC/O\n1M+XmHMny9wMWyEEOmA/H4wgE9mALA0//wYtfvwxBa5roXdV45OGHfiV8hvpf8uS\nPP9AN/VLo+zutpLLo+LPRqGLh+HuRuPOlAuaH+oABOhjFi1PXw1/rg60DNq768ZG\nmmapORv3AgMBAAECggEABkE58h7a2G16+t7q7b6Hs1A2jj09wLF+DUlKSg8PDU4+\nG/vjq+xc2fdIUB5Nf4ey+ixVeWbJDS0HCcjatUk6LVcnEjj8nPffYTN7iTNl2TLx\n52bM5YoZ9stvMx40U3cA4Xg6VC5zMv3VkReL7qovUT2j0fmd9HD2wiUrNs0p70CZ\ndar+k2zpoN2pn5q8uWEXudlHrQEPu1rdN0JDv9Aq9c/EcizGjanZ4cKaZrtRdDqR\nX8fZKxZGQddlKtaXnInUcs9G8lgkZyd1Yr+RqSKcaZeDNUwDkGR9jw7q/nMz+0Y3\nm7dnC1J3JVeNFpYAheNihunK/OFKq1U6ouSuiyhxmQKBgQDlEFvGL3g5kbPsII1y\ns8eN15hWiWYTzAFF3t3E8gaWBUyE0fgWcsSFA4BlUF9Dd5Ab/qC6ZZihufRVBAL8\nPQa+s154h6UbS5s6GG6N+HYbrDRzVKjrSLonhEN/rrc2ou0sKqNoe6gKXC0JuD0P\npcRjTVdIXRmdTBmtQvuZNThDewKBgQDXymiY6cGsynKk2s1sDAzKrmOglw4zKyDR\nzkOci0rd+zhJIG9AxzEto4G1qcFYeERyPQAgQf+Dkf/77IgeWip9M7sRZ8NySrTf\nWSIy+VhF4gHEgejkmTbpSjsylFIA+NjTvpZ4GoxRAyQly6LXA3NN6fMvKql/M0y8\nRS4A9jxStQKBgQCb9WhW5okXwUFcWsmTuB39UDYTbVdH0VVoihY6eoLLb+4qXH9q\nYVe2LK0lzfQejnBa7yHl5zhlnKNjouiZbr+B5cRDki9zByY4Btx24x0fOD856wFb\nuNeuAhqm+4EYvRN4R8ucXt0JuLqdbIh+d+Hfro/n4COJen/c/McrCBY3swKBgCJY\nfgNwmTnmUw74IGAFHvgXf5Xs1P7B64xZNxuwc+8W8CN7fRmjWql378o5RaPOKJ7C\nJMX9myyWzVaMlDG4ijC5Thn8GPiU+WrfJflVBH7C9SMQxj+0PzAsd3Wac97hvKkf\nGZXuK80tIdC+M6HjU7Pf+6vTL30mbh09KZBPoNRNAoGAVVfr+gFCwlGo7nvOglxQ\nwe0wkWiiUQK+8E9CDDuB3xXZE+Ygi+vEYOUh6XVkRt8Ft4jHZmpSazeoJYDsMwDi\nKrIiZPDrd1qh03Fq+6wQGCZ2JHSyYb+ol73ZYzAP5nwHUntVNASmEOgCA7mfhClG\nj7Lx4xj6gR3qh8UhiOca1rg=\n-----END PRIVATE KEY-----\n',
   client_email: 'firebase-adminsdk-ld6ft@decodeit-f84ea.iam.gserviceaccount.com',
   client_id: '108125243908059976401',
   auth_uri: 'https://accounts.google.com/o/oauth2/auth',
   token_uri: 'https://oauth2.googleapis.com/token',
   auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
   client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ld6ft%40decodeit-f84ea.iam.gserviceaccount.com',
   universe_domain: 'googleapis.com',
};

export const app =
   activeApps.length === 0
      ? initializeApp({
           credential: cert(serviceAccount as ServiceAccount),
        })
      : activeApps[0];
