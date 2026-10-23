<?xml version='1.0' encoding='UTF-8'?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:s="urn:coursekit:semantic"
    xmlns:d="urn:coursekit:semantic:document"
    xmlns:p="urn:coursekit:page"
    xmlns:mp="urn:coursekit:page:document"
    xmlns:ms="urn:coursekit:semantic:document"
    xmlns:mc="urn:coursekit:visual:document"
    version="1.0">

  <xsl:output method="xml"/>
  <xsl:template match="/s:content">
    <mp:document-page>
      <p:meta>
        <p:var name="course-code" ref="course.code"/>
        <p:var name="course-title" ref="course.title"/>
        <p:var name="course-section" ref="course.section"/>
        <p:var name="course-term" ref="course.term"/>
        <p:var name="course-year" ref="course.year"/>
      </p:meta>
      <mp:document-layout>
        <xsl:copy-of select="@cover|@style-ref|@variant"/>
        <mp:document-toolbar/>
        <mp:document-cover>
          <mp:document-cover-brand code="${{course-code}}" course="${{course-title}}" logo="{@institution-logo}" institution="{@institution-name}" faculty="{@institution-faculty}" department="{@institution-department}" program="{@program-name}"/>
          <mp:document-cover-title title="{@title}" subtitle="{@subtitle}" kicker="{@kicker}"/>
          <mp:document-cover-meta section="${{course-section}}" term="${{course-term}}" year="${{course-year}}" author="{@instructor}" date="{@date}" version="{@version}"/>
        </mp:document-cover>
        <mp:document-blank/>
        <mp:document-sheet>
          <mp:document-page-frame>
            <mp:document-header code="${{course-code}}" course="${{course-title}}" section="${{course-section}}" logo="{@institution-logo}"/>
            <mp:document-body/>
            <mp:document-footer program="{@program-name}" text="{@footer-text}" term="${{course-term}}" year="${{course-year}}"/>
          </mp:document-page-frame>
        </mp:document-sheet>
        <mp:document-flow>
          <xsl:apply-templates select="node()" mode="doc"/>
        </mp:document-flow>
        <mp:document-end/>
      </mp:document-layout>
    </mp:document-page>
  </xsl:template>
  <xsl:template match="ms:section|d:section" mode="doc">
    <mp:document-section title="{@title}">
      <xsl:copy-of select="@id"/>
      <xsl:apply-templates select="node()" mode="doc"/>
    </mp:document-section>
  </xsl:template>
  <xsl:template match="s:paragraph" mode="doc">
    <mp:document-paragraph>
      <xsl:apply-templates select="node()" mode="doc-inline"/>
    </mp:document-paragraph>
  </xsl:template>
  <xsl:template match="text()" mode="doc-inline">
    <xsl:value-of select="."/>
  </xsl:template>
  <xsl:template match="s:important" mode="doc-inline">
    <p:text-style variant="important">
      <xsl:apply-templates select="node()" mode="doc-inline"/>
    </p:text-style>
  </xsl:template>
  <xsl:template match="s:note|s:information" mode="doc">
    <mp:document-note title="{@title}">
      <xsl:apply-templates select="node()" mode="doc"/>
    </mp:document-note>
  </xsl:template>
  <xsl:template match="s:list" mode="doc">
    <mp:document-list>
      <xsl:apply-templates select="node()" mode="doc"/>
    </mp:document-list>
  </xsl:template>
  <xsl:template match="s:item" mode="doc">
    <p:item>
      <xsl:apply-templates select="node()" mode="doc-inline"/>
    </p:item>
  </xsl:template>
  <xsl:template match="s:picture" mode="doc">
    <mp:document-figure src="{@src}" alt="{normalize-space(.)}" caption="{@title}"/>
  </xsl:template>
  <xsl:template match="d:author" mode="doc">
    <mp:document-author name="{@name}" role="{@role}"/>
  </xsl:template>
  <xsl:template match="d:break" mode="doc">
    <mp:document-break/>
  </xsl:template>
</xsl:stylesheet>
