/**
 * SEO Schema Correction Tests
 * Validates the structured-data corrections applied per the audit report.
 * Run with: node tests/seo-schema.test.js
 *
 * No test framework required — uses Node.js assert module.
 */
import assert from "node:assert/strict";
import { getPersonSchema, getWebSiteSchema } from "../lib/seo/schema.js";

let passed = 0;
let failed = 0;

function test(label, fn) {
  try {
    fn();
    console.log(`  ✅  ${label}`);
    passed++;
  } catch (err) {
    console.error(`  ❌  ${label}`);
    console.error(`      ${err.message}`);
    failed++;
  }
}

// --- Person schema ---
console.log("\nPerson Entity\n--------------");
const person = getPersonSchema();

test('@type is "Person"', () => { assert.equal(person["@type"], "Person"); });
test('@id is exactly "https://vedaangsharma.in/#person"', () => { assert.equal(person["@id"], "https://vedaangsharma.in/#person"); });
test('name is "Vedaang Sharma"', () => { assert.equal(person.name, "Vedaang Sharma"); });

// --- Person.url ---
console.log("\nPerson.url\n--------------");
test("Person.url has trailing slash", () => {
  assert.ok(person.url.endsWith("/"), `Expected trailing slash, got: ${person.url}`);
});
test("Person.url uses canonical domain", () => {
  assert.ok(person.url.startsWith("https://vedaangsharma.in"), `Unexpected domain: ${person.url}`);
});

// --- sameAs ---
console.log("\nsameAs Identity Graph\n--------------");
const sameAs = person.sameAs ?? [];

test("sameAs is an array", () => { assert.ok(Array.isArray(sameAs)); });
test('sameAs includes canonical URL', () => { assert.ok(sameAs.includes("https://vedaangsharma.in/")); });
test('sameAs includes GitHub', () => { assert.ok(sameAs.includes("https://github.com/gtathelegend")); });
test('sameAs includes PyPI', () => { assert.ok(sameAs.includes("https://pypi.org/user/vedaangsharma2006/")); });
test('sameAs includes LinkedIn', () => { assert.ok(sameAs.includes("https://www.linkedin.com/in/vedaangsharma2006/")); });
test('sameAs does NOT include erroneous gtathelegend PyPI', () => {
  assert.ok(!sameAs.includes("https://pypi.org/user/gtathelegend/"), "Erroneous gtathelegend PyPI must not appear");
});
test("canonical URL is first sameAs entry", () => {
  assert.equal(sameAs[0], "https://vedaangsharma.in/");
});

// --- BehaviourSim creator ---
console.log("\nBehaviourSim Relationship\n--------------");
const creator = person.creator;

test("Person has creator property", () => { assert.ok(creator != null); });
test('creator["@type"] is "SoftwareApplication"', () => { assert.equal(creator?.["@type"], "SoftwareApplication"); });
test('creator.name is "BehaviourSim"', () => { assert.equal(creator?.name, "BehaviourSim"); });
test('creator.url is "https://behavioursim.vedaangsharma.in/"', () => { assert.equal(creator?.url, "https://behavioursim.vedaangsharma.in/"); });

// --- No worksFor BehaviourSim ---
console.log("\nNo Incorrect Employer Relationship\n--------------");
test("worksFor does not include BehaviourSim", () => {
  const entries = Array.isArray(person.worksFor) ? person.worksFor : (person.worksFor ? [person.worksFor] : []);
  const hasBehaviourSim = entries.some(e => typeof e.name === "string" && e.name.toLowerCase().includes("behavioursim"));
  assert.ok(!hasBehaviourSim, "BehaviourSim must NOT appear in worksFor");
});

// --- WebSite schema ---
console.log("\nWebSite Schema\n--------------");
const website = getWebSiteSchema();

test('@type is "WebSite"', () => { assert.equal(website["@type"], "WebSite"); });
test('@id is "https://vedaangsharma.in/#website"', () => { assert.equal(website["@id"], "https://vedaangsharma.in/#website"); });
test("WebSite.url has trailing slash", () => { assert.ok(website.url.endsWith("/"), `Got: ${website.url}`); });
test('WebSite.author["@id"] is canonical Person @id', () => { assert.equal(website.author?.["@id"], "https://vedaangsharma.in/#person"); });
test('WebSite.publisher["@id"] is canonical Person @id', () => { assert.equal(website.publisher?.["@id"], "https://vedaangsharma.in/#person"); });

// --- Safety: no double slash in @id ---
console.log("\nSafety: @id not double-slashed\n--------------");
test("Person @id does not contain double slash", () => {
  assert.ok(!person["@id"].includes("//", 8), `@id: ${person["@id"]}`);
});
test("WebSite @id does not contain double slash", () => {
  assert.ok(!website["@id"].includes("//", 8), `@id: ${website["@id"]}`);
});

// --- About page Microdata ---
console.log("\nAbout Page Microdata\n--------------");
import fs from "node:fs";
const aboutContent = fs.readFileSync(
  new URL("../app/about/components/about/about.jsx", import.meta.url),
  "utf-8"
);
test('About Person microdata contains canonical itemID', () => {
  assert.ok(
    aboutContent.includes('itemID="https://vedaangsharma.in/#person"'),
    "about.jsx must specify itemID=\"https://vedaangsharma.in/#person\""
  );
});
test('About Person microdata specifies schema.org/Person itemType', () => {
  assert.ok(
    aboutContent.includes('itemType="https://schema.org/Person"'),
    "about.jsx must specify itemType=\"https://schema.org/Person\""
  );
});

// --- Summary ---
console.log(`\n${"─".repeat(48)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
